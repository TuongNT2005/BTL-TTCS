package com.example.shop.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.shop.dto_interface.UserWithCartItems;
import com.example.shop.entity.User;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    public Optional<User> findByUsername(String username);
    public Optional<User> findByUsernameAndPassword(String username, String passoword);
    public Boolean existsByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.role != 'ADMIN' AND u.username LIKE CONCAT('%', :keyword, '%')")
    public Page<User> searchUser(Pageable pageable, @Param(value = "keyword") String keyword);

    @EntityGraph(attributePaths = {"cartItems"})
    public UserWithCartItems findABCById(Integer id);


    @Query(value = """
        select u.id, u.email, u.avatar, sum(oi.quantity) 'boughtProducts', sum(oi.quantity * oi.price) 'spending'
        from orderitem oi left join
        orders o on oi.orderId = o.id left join 
        user u on u.id = o.userId
        where o.createdAt between :startAt and :endAt and (o.status = 'PAID' or o.status = 'DELIVERIED')
        group by u.id, u.email, u.avatar
        order by spending desc, boughtProducts desc
        limit 10
            """, nativeQuery = true)
    public List<Object[]> getTopSpendingUsers(@Param(value = "startAt") LocalDateTime startAt,
                                    @Param(value = "endAt") LocalDateTime endAt);
}
