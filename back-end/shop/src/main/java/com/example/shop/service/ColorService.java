package com.example.shop.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.shop.entity.Color;
import com.example.shop.repository.ColorRepository;
import com.example.shop.util.Converter;

@Service
public class ColorService {

    @Autowired
    private ColorRepository colorRepository;


    public Integer findColorId(String colorName) {
        try {
            String fomatedColorName = Converter.convertStringToCapitalizedForm(colorName);
            Optional<Color> container = colorRepository.findByName(fomatedColorName);
            if (container.isEmpty()) {
                return null;
            }
            Color color = colorRepository.findByName(fomatedColorName).get();
            return color.getId();
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public Color createNewColor(String colorName) {
        try {
            String fomatedColorName = Converter.convertStringToCapitalizedForm(colorName);
            Color newColor = Color.builder().name(fomatedColorName).build();
                colorRepository.save(newColor);
            return newColor;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    public String findColorNameById(Integer colorId) {
        return colorRepository.findNameById(colorId)
            .orElseThrow(() -> new RuntimeException(String.format("Không tồn tại màu sắc ứng với id=%d", colorId)));
    }

}
