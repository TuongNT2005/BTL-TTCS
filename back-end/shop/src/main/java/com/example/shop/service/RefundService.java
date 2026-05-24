package com.example.shop.service;

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
import com.example.shop.enums.RefundStatus;
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
    private RefundRequestRepository refundRequestRepository;
    @Autowired
    private UserService userService;


    public void checkCreateRefundRequestConditions(CreateRefundRequest request) {
        try {
            OrderItem item = orderService.findOrderItemById(request.getOrderItemId());
            Integer quantityOfReturnedItem = refundRequestRepository.getReturnedItemQuantityByOrderItemId(item.getId());
            if (request.getQuantity() <= 0) {
                throw new ActionUnavalibleException("Số lượng cần hoàn trả không được nhỏ hơn = 0!");
            } else if (request.getQuantity() + quantityOfReturnedItem > item.getQuantity()) {
                throw new ActionUnavalibleException(String.format("Bạn chỉ có thể yêu cầu hoàn trả tối đa %d sản phẩm!",
                        item.getQuantity() - quantityOfReturnedItem));
            }
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public RefundRequest createNewRefundRequest(CreateRefundRequest request, User user) {
        checkCreateRefundRequestConditions(request);
        try {
            String imgName = FileUtil.saveFileToDir(request.getImg(), "refund", FileUtil.genFileName("refund_"));
            RefundRequest refundRequest = RefundRequest.builder()
                    .createdAt(LocalDateTime.now())
                    .image(imgName)
                    .orderItemId(request.getOrderItemId())
                    .reason(request.getReason())
                    .status(RefundStatus.PENDING)
                    .userId(user.getId())
                    .quantity(request.getQuantity())
                    .build();

            refundRequestRepository.save(refundRequest);

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
        if (refundRequest.getStatus() != RefundStatus.ACCEPTED) {
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
            refundRequest.setStatus(RefundStatus.DONE);
            user.setCoin(user.getCoin() + orderItem.getPrice() * refundRequest.getQuantity());

            refundRequestRepository.save(refundRequest);
            userService.saveUser(user);

            return refundRequest;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public RefundRequest handleRefundRequest(HandleRefundRequest request) {
        if (!isStatusValid(request.getStatus())) {
            throw new ActionUnavalibleException("Không thể thực hiện do trạng thái không hợp lệ!");
        }
        
        try {
            RefundRequest refundRequest = findByRefundRequestId(request.getRefundRequestId());
            if(refundRequest.getStatus() != RefundStatus.PENDING) {
                throw new ActionUnavalibleException("Không thể thực hiện do trạng thái khác PENDING");
            }
            refundRequest.setStatus(RefundStatus.valueOf(request.getStatus()));
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
                if (status != null && !status.trim().equals("")) {
                    throw new ActionUnavalibleException("Không thể thực hiện do trạng thái không hợp lệ!");
                }
            }
            return refundRequestRepository.searchRefundRequest(PageRequest.of(pageNumber, ConstantVal.itemPerPage),
                    status, keyword);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Page<RefundRequest> searchRefundRequestByUserId(Integer pageNumber, String status, String keyword, Integer userId) {
        try {
            if (!isStatusValid(status)) {
                if (status != null && !status.trim().equals("")) {
                    throw new ActionUnavalibleException("Không thể thực hiện do trạng thái không hợp lệ!");
                }
            }
            return refundRequestRepository.searchRefundRequestByUserId(PageRequest.of(pageNumber, ConstantVal.itemPerPage),
                    status, keyword, userId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

}
