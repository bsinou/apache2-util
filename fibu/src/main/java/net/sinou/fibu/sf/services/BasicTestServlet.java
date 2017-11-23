package net.sinou.fibu.sf.services;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.GregorianCalendar;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

import net.sinou.fibu.sf.model.Payment;

public class BasicTestServlet extends HttpServlet {
	private static final long serialVersionUID = -7017878226363233749L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		resp.setContentType("application/json");

		ObjectMapper mapper = new ObjectMapper();
		String amount = req.getParameter("amount");

		Payment pay = new Payment(new GregorianCalendar(), BigDecimal.TEN, "Jacky", "La pizza à " + amount + " euros");

		PrintWriter out = resp.getWriter();
		mapper.writerWithDefaultPrettyPrinter().writeValue(out, pay);
	}

}
