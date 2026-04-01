package com.example.shop.service;

import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.UserRepository;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateRefundRequest;
import com.example.shop.dto.request.HandleRefundRequest;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.RefundRequest;
import com.example.shop.entity.User;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.RefundRequestRepository;
import com.example.shop.util.FileUtil;

@Service
public class RefundService {

    @Autowired private OrderService orderService;
    @Autowired private AuthService authService;
    @Autowired private RefundRequestRepository refundRequestRepository;
    @Autowired private UserService userService;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderItemRepository orderItemRepository;


    public RefundRequest createNewRefundRequest(CreateRefundRequest request) {
        OrderItem orderItem = orderService.findOrderItemById(request.getOrderItemId());
        if (orderItem.getReturned() != OrderItem.Returned.FALSE) {
            throw new ActionUnavalibleException(
                    String.format("KHông thể yêu cầu hoàn tiền sản phẩm này vì trạng thái của sản phẩm đang là: %s",
                            orderItem.getReturned().toString()));
        }
        try {
            String imgName = FileUtil.saveFileToDir(request.getImg(), "refund", FileUtil.genFileName("refund_"));
            RefundRequest refundRequest = RefundRequest.builder()
                    .createdAt(LocalDateTime.now())
                    .image(imgName)
                    .orderItemId(request.getOrderItemId())
                    .reason(request.getReason())
                    .status(RefundRequest.Status.PENDING)
                    .userId(authService.getAuthenticatedUserId())
                    .build();

            orderItem.setReturned(OrderItem.Returned.PENDING);
            refundRequestRepository.save(refundRequest);
            orderItemRepository.save(orderItem);

            return refundRequest;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public RefundRequest findByRefundRequestId(Integer refundRequestId) {
        return refundRequestRepository.findById(refundRequestId)
                .orElseThrow(() -> new NotFoundException(String.format(
                        "Đơn yêu cầu hoàn tiền, hoàn hàng có id=%d không tồn tại trong hệ thống!", refundRequestId)));
    }

    public RefundRequest checkRefundCoinCondition(Integer refundRequestId) {
        RefundRequest refundRequest = findByRefundRequestId(refundRequestId);
        if(refundRequest.getStatus() != RefundRequest.Status.ACCEPTED) {
            throw new ActionUnavalibleException(String.format(
                "Không thể thực hiện hoàn coin vì trạng thái của yêu cầu hoàn tiền, hoàn hàng đang là: %s", 
                refundRequest.getStatus().toString()));
        }
        return refundRequest;
    }

    public RefundRequest refundToUserUsingCoin(Integer refundRequestId) {
        RefundRequest refundRequest = checkRefundCoinCondition(refundRequestId);
        User user = userService.findUserById(refundRequest.getUserId());
        OrderItem orderItem = orderService.findOrderItemById(refundRequest.getOrderItemId());
        try {
            refundRequest.setStatus(RefundRequest.Status.DONE);
            orderItem.setReturned(OrderItem.Returned.TRUE);
            user.setCoin(user.getCoin() + orderItem.getPrice());

            refundRequestRepository.save(refundRequest);
            orderItemRepository.save(orderItem);
            userRepository.save(user);

            return refundRequest;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public RefundRequest handleRefundRequest(HandleRefundRequest request) {
        RefundRequest refundRequest = findByRefundRequestId(request.getRefundRequestId());
        try {
            refundRequest.setStatus(RefundRequest.Status.valueOf(request.getStatus()));
            OrderItem orderItem = orderService.findOrderItemById(refundRequest.getOrderItemId());
            if(refundRequest.getStatus() == RefundRequest.Status.REJECTED) {
                orderItem.setReturned(OrderItem.Returned.FALSE);
            }

            orderItemRepository.save(orderItem);
            refundRequestRepository.save(refundRequest);
            return findByRefundRequestId(refundRequest.getId());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }

    }
}
