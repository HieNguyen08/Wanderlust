package com.wanderlust.api.services;

import java.util.List;

public interface BaseServices<T> {
  T create(T t);
  T findByID(String id);
  List<T> findAll();
  T update(T t);
  void delete(String id);
  void deleteAll();
}
