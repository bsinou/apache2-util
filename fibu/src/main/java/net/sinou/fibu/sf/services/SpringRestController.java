package net.sinou.fibu.sf.services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.GregorianCalendar;
import java.util.List;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.sinou.fibu.sf.model.Payment;

@RestController
public class SpringRestController {

	@RequestMapping("/payments")
	public List<Payment> greeting(@RequestParam(value = "status", defaultValue = "all") String status) {
		List<Payment> payments = new ArrayList<Payment>();
		Payment payment = new Payment(GregorianCalendar.getInstance(), BigDecimal.TEN, "GroceryStore",
				"Weekly coffee stock");
		payments.add(payment);
		return payments;
	}
}