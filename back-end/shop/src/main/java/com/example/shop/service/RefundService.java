package com.example.shop.service;

import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.UserRepository;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.shop.dto.request.CreateRefundRequest;
import com.example.shop.dto.request.HandleRefundRequest;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.RefundRequest;
import com.example.shop.entity.User;
import com.example.shop.enums.Returned;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.RefundRequestRepository;
import com.example.shop.util.ConstantVal;
import com.example.shop.util.FileUtil;

@Service
public class RefundService {

    @Autowired
    private OrderService orderService;
    @Autowired
    private AuthService authService;
    @Autowired
    private RefundRequestRepository refundRequestRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    public RefundRequest createNewRefundRequest(CreateRefundRequest request) {
        OrderItem orderItem = orderService.findOrderItemById(request.getOrderItemId());
        if (orderItem.getReturned() != Returned.FALSE) {
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

            orderItem.setReturned(Returned.PENDING);
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
        if (refundRequest.getStatus() != RefundRequest.Status.ACCEPTED) {
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
            orderItem.setReturned(Returned.TRUE);
            user.setCoin(user.getCoin() + orderItem.getPrice());

            refundRequestRepository.save(refundRequest);
            orderItemRepository.save(orderItem);
            userService.saveUser(user);

            return refundRequest;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public RefundRequest handleRefundRequest(HandleRefundRequest request) {
        if(!isStatusValid(request.getStatus())) {
            throw new ActionUnavalibleException("Không thể thực hiện do trạng thái không hợp lệ!");
        }
        RefundRequest refundRequest = findByRefundRequestId(request.getRefundRequestId());
        try {
            refundRequest.setStatus(RefundRequest.Status.valueOf(request.getStatus()));
            OrderItem orderItem = orderService.findOrderItemById(refundRequest.getOrderItemId());
            if (refundRequest.getStatus() == RefundRequest.Status.REJECTED) {
                orderItem.setReturned(Returned.FALSE);
            }
            else {
                orderItem.setReturned(Returned.PENDING);
            }

            orderItemRepository.save(orderItem);
            refundRequestRepository.save(refundRequest);
            return findByRefundRequestId(refundRequest.getId());
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Boolean isStatusValid(String status) {
        if (status == null || status.trim().equals(""))
            return false;
        String upperCaseStatus = status.toUpperCase();
        if (!(upperCaseStatus.equals("PENDING") || upperCaseStatus.equals("ACCEPTED")
                || upperCaseStatus.equals("REJECTED") || upperCaseStatus.equals("DONE"))) {
            return false;
        }
        return true;
    }

    public Page<RefundRequest> searchRefundRequest(Integer pageNumber, String status, String keyword) {
        try {
            if (!isStatusValid(status)) {
                if(status != null && !status.trim().equals("")) {
                    throw new ActionUnavalibleException("Không thể thực hiện do trạng thái không hợp lệ!");
                } 
            }
            return refundRequestRepository.searchRefundRequest(PageRequest.of(pageNumber, ConstantVal.itemPerPage), status, keyword);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}
