package net.sinou.fibu.sf.sandbox;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.GregorianCalendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import net.sinou.fibu.sf.FibuMicroservice;
import net.sinou.fibu.sf.jpa.AccountRepository;
import net.sinou.fibu.sf.jpa.PaymentRepository;
import net.sinou.fibu.sf.model.Account;
import net.sinou.fibu.sf.model.Payment;

@Profile("development")
@Component
public class DemoApplicationBeans {
	private final Logger log = LoggerFactory.getLogger(FibuMicroservice.class);

	@Bean
	public CommandLineRunner demo(AccountRepository accRepo, PaymentRepository repository) {
		return (args) -> {
			// save a couple of accounts
			accRepo.save(new Account("512", "Caisse"));
			accRepo.save(new Account("520", "Bank"));

			// save a couple of payments
			Calendar cal = GregorianCalendar.getInstance();
			BigDecimal amount = BigDecimal.TEN.add(BigDecimal.ONE);

			cal.add(Calendar.WEEK_OF_YEAR, -1);
			repository.save(new Payment(cal, amount, "Grocery Store", "Weekly coffee stock"));

			cal.add(Calendar.WEEK_OF_YEAR, -1);
			repository.save(new Payment(cal, amount, "Grocery Store", "Weekly coffee stock"));

			cal.add(Calendar.WEEK_OF_YEAR, -1);
			repository.save(new Payment(cal, amount, "Grocery Store", "Weekly coffee stock"));

			cal = GregorianCalendar.getInstance();
			cal.add(Calendar.WEEK_OF_YEAR, -1);
			amount = amount.add(amount);
			repository.save(new Payment(cal, amount, "Internet provider", "Monthly bill"));

			cal.add(Calendar.DAY_OF_YEAR, 2);
			amount = amount.multiply(BigDecimal.TEN);
			repository.save(new Payment(cal, amount, "Estate agent", "Monthly rent"));

			// fetch all payments
			log.info("Payments found with findAll():");
			log.info("-------------------------------");
			for (Payment payment : repository.findAll()) {
				log.info(payment.toString());
			}
			log.info("");

			// fetch an individual payment by ID
			Payment payment = repository.findOne(1L);
			log.info("Payment found with findOne(1L):");
			log.info("--------------------------------");
			log.info(payment.toString());
			log.info("");

			// fetch payment by counterparty
			log.info("Customer found with findByCounterparty('Grocery Store'):");
			log.info("--------------------------------------------");
			for (Payment gs : repository.findByCounterparty("Grocery Store")) {
				log.info(gs.toString());
			}
			log.info("");
		};
	}

}
