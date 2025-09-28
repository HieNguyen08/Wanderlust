package com.wanderlust.api.response;

import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus
public class DocumentNotFoundException extends RuntimeException {
  private static final long serialVersionUID = 1;

  public DocumentNotFoundException(String message) {
    super(message);
  }
  
  public DocumentNotFoundException(String message, Throwable throwable) {
    super(message, throwable);
  }
}
