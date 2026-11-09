package com.example.shop.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.shop.dto.projection_interface.UserInfoWithoutPassProjection;
import com.example.shop.dto.projection_interface.UserWithCartItems;
import com.example.shop.dto.projection_interface.UserWithOrders;
import com.example.shop.dto.projection_interface.UserWithSpending;
import com.example.shop.entity.User;
import com.example.shop.exception.NotFoundException;


public interface UserRepository extends JpaRepository<User, Integer>, JpaSpecificationExecutor<User> {
    public Optional<User> findByUsername(String username);
    public Optional<User> findByUsernameAndPassword(String username, String passoword);
    public Boolean existsByUsername(String username);
    public Boolean existsByEmail(String email);

    public default User findUserById(Integer id) {
        return findById(id).orElseThrow(
            () -> new NotFoundException("Người dùng với id: " + id+ " không tồn tại!")
        );
    }

    @Query("SELECT u FROM User u WHERE u.role != 'ADMIN' AND u.username LIKE CONCAT('%', :keyword, '%')")
    public Page<User> searchUser(Pageable pageable, @Param(value = "keyword") String keyword);

    @EntityGraph(attributePaths = {"cartItems"})
    public UserWithCartItems findUserDtoWithCartItemsById(Integer id);

    @EntityGraph(attributePaths = {"cartItems"})
    public Page<UserWithCartItems> findUserDtoWithCartItemsAllById(Pageable pageable, Integer id);

    @EntityGraph(attributePaths = {"orders"})
    public UserWithOrders findUserDtoWithOrdersById(Integer id);

    @EntityGraph(attributePaths = {"cartItems"})
    public List<User> findUserWithCartItemsById(Integer id);

    @EntityGraph(attributePaths = {"orders"})
    public UserWithOrders findUserWithOrdersById(Integer id);
    public Optional<UserInfoWithoutPassProjection> findUserInfoWithoutPassById(Integer id);

    public Page<UserInfoWithoutPassProjection> findBy(Specification<User> spec, Pageable pageable);

    @Modifying
    @Query("UPDATE User u SET u.coin = u.coin - :coin WHERE u.id = :userId AND u.coin >= :coin")
    public int deductCoin(@Param("userId") Integer userId, @Param("coin") Long coin);

    @Modifying
    @Query("UPDATE User u SET u.coin = u.coin + :coin WHERE u.id = :userId")
    public int addCoin(@Param("userId") Integer userId, @Param("coin") Long coin);

    // @Query(value = """
    //     select u.id, u.email, u.avatar, sum(oi.quantity) 'boughtProducts', sum(oi.quantity * oi.price) 'spending'
    //     from orderitem oi left join
    //     orders o on oi.orderId = o.id left join 
    //     user u on u.id = o.userId
    //     where o.createdAt between :startAt and :endAt and (o.status = 'PAID' or o.status = 'DELIVERIED')
    //     group by u.id, u.email, u.avatar
    //     order by spending desc, boughtProducts desc
    //     limit 10
    //         """, nativeQuery = true)
    // public List<Object[]> getTopSpendingUsers(@Param(value = "startAt") LocalDateTime startAt,
    //                                 @Param(value = "endAt") LocalDateTime endAt);

    @Query("""
            select u.id as id, u.email as email, u.avatar as avatar, SUM(oi.quantity) as boughtProducts, sum(oi.quantity * oi.price) as spending  
            FROM OrderItem oi 
            JOIN oi.order o 
            JOIN o.user u 
            WHERE o.status = 'PAID' OR o.status = 'DELIVERIED'
            GROUP BY u.id, u.email, u.avatar
            """)
    public List<UserWithSpending> getTopSpendingUsers();


}
