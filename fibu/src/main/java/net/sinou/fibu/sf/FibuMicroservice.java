package net.sinou.fibu.sf;

import java.math.BigDecimal;
import java.util.Calendar;
import java.util.GregorianCalendar;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import net.sinou.fibu.sf.jpa.PaymentRepository;
import net.sinou.fibu.sf.model.Payment;

@SpringBootApplication
// @ComponentScan(basePackages = "net.sinou.fibu.sf.services,
// net.sinou.fibu.sf.jpa, net.sinou.fibu.sf.model")
public class FibuMicroservice {
	private final Logger log = LoggerFactory.getLogger(FibuMicroservice.class);

	public static void main(String[] args) {
		SpringApplication.run(FibuMicroservice.class, args);
	}
}