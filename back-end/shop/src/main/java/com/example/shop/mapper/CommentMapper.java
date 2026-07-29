package com.example.shop.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import com.example.shop.dto.response.CommentDTO;
import com.example.shop.entity.Comment;
import com.example.shop.entity.User;

@Component
public class CommentMapper {

    @Autowired
    @Lazy
    private UserMapper userMapper;

    public CommentDTO toCommentDTO(Comment comment, User user) {
        return new CommentDTO(userMapper.toUserDTO(user), comment);
    }
}
