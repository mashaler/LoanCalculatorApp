
package com.example.loancalculator;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/loan")
@CrossOrigin(origins = "*")
public class LoanController {

    @GetMapping("/calculate")
    public LoanResponse calculateLoan(
            @RequestParam double principal,
            @RequestParam int months
    ) {
        double monthlyRate = 0.30;
        double totalAmount = principal * Math.pow(1 + monthlyRate, months);
        double profit = totalAmount - principal;

        totalAmount = Math.round(totalAmount * 100.0) / 100.0;
        profit = Math.round(profit * 100.0) / 100.0;

        return new LoanResponse(principal, months, totalAmount, profit);
    }

    public static class LoanResponse {
        public double principal;
        public int months;
        public double totalAmount;
        public double profit;

        public LoanResponse(double principal, int months, double totalAmount, double profit) {
            this.principal = principal;
            this.months = months;
            this.totalAmount = totalAmount;
            this.profit = profit;
        }
    }
}
