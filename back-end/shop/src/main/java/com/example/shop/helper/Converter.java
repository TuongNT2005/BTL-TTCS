package com.example.shop.helper;



public class Converter {

    public static long convertPriceFromDoubleToLong(Double price) {
        if (price == null) {
            return 0L;
        }
        return (long) (price / 1000) * 1000L;
    }


}
