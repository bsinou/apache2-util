package net.sinou.fibu.sf.jpa;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import net.sinou.fibu.sf.model.Payment;

@RepositoryRestResource(collectionResourceRel = "payments", path = "payments")
public interface PaymentRepository extends PagingAndSortingRepository<Payment, Long> {

	List<Payment> findByCounterparty(String counterparty);
}
