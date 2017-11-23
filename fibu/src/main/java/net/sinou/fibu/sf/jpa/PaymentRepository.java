package net.sinou.fibu.sf.jpa;


import java.util.List;

import org.springframework.data.repository.CrudRepository;

import net.sinou.fibu.sf.model.Payment;

public interface PaymentRepository extends CrudRepository<Payment, Long> {

    List<Payment> findByCounterparty(String counterparty);
}
