package com.example.shop.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.shop.dto.projection_interface.RefundRequestProjection;
import com.example.shop.dto.request.CreateRefundRequest;
import com.example.shop.dto.request.UpdateRefundRequest;
import com.example.shop.entity.OrderItem;
import com.example.shop.entity.RefundRequest;
import com.example.shop.entity.User;
import com.example.shop.enums.OrderStatus;
import com.example.shop.enums.RefundStatus;
import com.example.shop.enums.Returned;
import com.example.shop.exception.ActionUnavailableException;
import com.example.shop.exception.ActionUnavalibleException;
import com.example.shop.exception.NotFoundException;
import com.example.shop.repository.OrderItemRepository;
import com.example.shop.repository.ProductVariantRepository;
import com.example.shop.repository.RefundRequestRepository;
import com.example.shop.repository.UserRepository;
import com.example.shop.repository.specification.RefundRequestSpecification;

@Service
public class RefundRequestService {

    private final RefundRequestRepository refundRequestRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;

    public RefundRequestService(RefundRequestRepository refundRequestRepository,
                                OrderItemRepository orderItemRepository,
                                UserRepository userRepository,
                                ProductVariantRepository productVariantRepository) {
        this.refundRequestRepository = refundRequestRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.productVariantRepository = productVariantRepository;
    }

    @Transactional
    public RefundRequest createRefundRequest(CreateRefundRequest request, Integer userId) {
        User user = userRepository.findUserById(userId);

        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId()).orElseThrow(
            () -> new NotFoundException("Không tìm thấy chi tiết đơn hàng (orderItem)!")
        );

        if (!orderItem.getOrder().getUser().getId().equals(userId)) {
            throw new ActionUnavailableException("Bạn không thể tạo yêu cầu hoàn trả cho đơn hàng của người khác!");
        }

        if (orderItem.getOrder().getStatus() != OrderStatus.DELIVERIED) {
            throw new ActionUnavailableException("Chỉ đơn hàng đã giao thành công (DELIVERIED) mới có thể yêu cầu đổi trả!");
        }

        Integer returnedQuantity = refundRequestRepository.getReturnedItemQuantityByOrderItemId(orderItem.getId());
        if (returnedQuantity == null) {
            returnedQuantity = 0;
        }

        if (returnedQuantity + request.getQuantity() > orderItem.getQuantity()) {
            throw new ActionUnavailableException("Số lượng yêu cầu đổi trả vượt quá số lượng còn lại có thể đổi trả của mục này! Đã yêu cầu: " 
                + returnedQuantity + " / " + orderItem.getQuantity());
        }

        RefundRequest refundRequest = RefundRequest.builder()
                .user(user)
                .orderItem(orderItem)
                .reason(request.getReason())
                .image(request.getImage() != null ? request.getImage() : "")
                .quantity(request.getQuantity())
                .status(RefundStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        RefundRequest savedRefund = refundRequestRepository.save(refundRequest);

        orderItem.setReturned(Returned.PENDING);
        orderItemRepository.save(orderItem);

        return savedRefund;
    }

    public Page<RefundRequestProjection> searchRefundRequests(Pageable pageable, String status, String keyword, Integer userId) {
        Specification<RefundRequest> spec = Specification.where(RefundRequestSpecification.hasStatus(status))
                                                        .and(RefundRequestSpecification.hasUserId(userId))
                                                        .and(RefundRequestSpecification.hasProductName(keyword));

        return refundRequestRepository.findBy(spec, p -> p.as(RefundRequestProjection.class).page(pageable));
    }

    public RefundRequestProjection findRefundRequestById(Integer id) {
        return refundRequestRepository.findProjectedById(id).orElseThrow(
            () -> new NotFoundException("Yêu cầu hoàn hàng không tồn tại!")
        );
    }

    @Transactional
    public void updateRefundStatus(Integer refundRequestId, UpdateRefundRequest request) {
        RefundRequest refundRequest = refundRequestRepository.findById(refundRequestId).orElseThrow(
            () -> new NotFoundException("Không tìm thấy yêu cầu hoàn hàng!")
        );

        RefundStatus newStatus;
        try {
            newStatus = RefundStatus.valueOf(request.getStatus().toUpperCase());
        } catch (Exception e) {
            throw new ActionUnavalibleException("Trạng thái đổi trả không hợp lệ: " + request.getStatus());
        }

        refundRequest.setStatus(newStatus);
        refundRequestRepository.save(refundRequest);

        OrderItem orderItem = refundRequest.getOrderItem();
        if (newStatus == RefundStatus.ACCEPTED || newStatus == RefundStatus.DONE) {
            orderItem.setReturned(Returned.TRUE);
            orderItemRepository.save(orderItem);

            // Hoàn lại kho sản phẩm nếu là DONE
            if (newStatus == RefundStatus.DONE && orderItem.getProductVariant() != null) {
                productVariantRepository.increaseStock(orderItem.getProductVariant().getId(), refundRequest.getQuantity());
            }
        } else if (newStatus == RefundStatus.REJECTED) {
            orderItem.setReturned(Returned.FALSE);
            orderItemRepository.save(orderItem);
        }
    }
}

