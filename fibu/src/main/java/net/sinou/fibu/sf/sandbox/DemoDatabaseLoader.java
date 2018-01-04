package net.sinou.fibu.sf.sandbox;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.GregorianCalendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import net.sinou.fibu.sf.jpa.AccountRepository;
import net.sinou.fibu.sf.jpa.PaymentRepository;
import net.sinou.fibu.sf.jpa.UserRepository;
import net.sinou.fibu.sf.model.Account;
import net.sinou.fibu.sf.model.Payment;
import net.sinou.fibu.sf.model.User;
import net.sinou.fibu.sf.model.UserRole;

@Profile("development")
@Component
public class DemoDatabaseLoader implements CommandLineRunner {
	private final Logger log = LoggerFactory.getLogger(DemoDatabaseLoader.class);

	private final UserRepository userRepo;
	private final AccountRepository accountRepo;
	private final PaymentRepository paymentRepo;

	@Autowired
	public DemoDatabaseLoader(UserRepository userRepo, AccountRepository accountRepo, PaymentRepository paymentRepo) {

		this.userRepo = userRepo;
		this.accountRepo = accountRepo;
		this.paymentRepo = paymentRepo;
	}

	@Override
	public void run(String... strings) throws Exception {

		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("userAdmin",
				"doesn't matter", AuthorityUtils.createAuthorityList(UserRole.ROLE_USER_ADMIN.name())));

		// Create basic users
		// User admin =
		userRepo.save(new User("admin", new char[] { 'd', 'e', 'm', 'o' }, UserRole.ROLE_MANAGER.name(),
				UserRole.ROLE_USER_ADMIN.name(), UserRole.ROLE_REGISTERED.name()));
		userRepo.save(new User("demo", new char[] { 'd', 'e', 'm', 'o' }, UserRole.ROLE_REGISTERED.name()));

		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("admin",
				"doesn't matter", AuthorityUtils.createAuthorityList(UserRole.ROLE_MANAGER.name())));

		// save a couple of accounts
		accountRepo.save(new Account("512", "Caisse"));
		accountRepo.save(new Account("520", "Bank"));

		// save a couple of payments
		Calendar cal = GregorianCalendar.getInstance();
		BigDecimal amount = BigDecimal.TEN.add(BigDecimal.ONE);

		cal.add(Calendar.WEEK_OF_YEAR, -1);
		paymentRepo.save(new Payment(cal, amount, "Grocery Store", "Weekly coffee stock"));

		cal.add(Calendar.WEEK_OF_YEAR, -1);
		paymentRepo.save(new Payment(cal, amount, "Grocery Store", "Weekly coffee stock"));

		cal.add(Calendar.WEEK_OF_YEAR, -1);
		paymentRepo.save(new Payment(cal, amount, "Grocery Store", "Weekly coffee stock"));

		cal = GregorianCalendar.getInstance();
		cal.add(Calendar.WEEK_OF_YEAR, -1);
		amount = amount.add(amount);
		paymentRepo.save(new Payment(cal, amount, "Internet provider", "Monthly bill"));

		cal.add(Calendar.DAY_OF_YEAR, 2);
		amount = amount.multiply(BigDecimal.TEN);
		paymentRepo.save(new Payment(cal, amount, "Estate agent", "Monthly rent"));

		// fetch all payments
		log.info("Payments found with findAll():");
		log.info("-------------------------------");
		for (Payment payment : paymentRepo.findAll()) {
			log.info(payment.toString());
		}
		log.info("");

		// fetch an individual payment by ID
		Payment payment = paymentRepo.findOne(1L);
		log.info("Payment found with findOne(1L):");
		log.info("--------------------------------");
		log.info(payment.toString());
		log.info("");

		// fetch payment by counterparty
		log.info("Customer found with findByCounterparty('Grocery Store'):");
		log.info("--------------------------------------------");
		for (Payment gs : paymentRepo.findByCounterparty("Grocery Store")) {
			log.info(gs.toString());
		}
		log.info("");
	};
}
