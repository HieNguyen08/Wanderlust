package com.wanderlust.api.entity.types;

public enum TransactionType {
    CREDIT,      // Nạp tiền vào ví
    DEBIT,       // Thanh toán từ ví
    REFUND,       // Hoàn tiền (từ vendor hoặc admin)
    WITHDRAW      // Rút tiền từ ví
}