package com.jonathan;

import com.jonathan.app.Calculator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

public class JUnitTest {

    Calculator calc = new Calculator();

    @Test
    @DisplayName("\uD83D\uDE31")
    void testAdd(){
        Assertions.assertEquals(2, calc.add(1, 1));
    }
}
