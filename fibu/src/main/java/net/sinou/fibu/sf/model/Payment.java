package net.sinou.fibu.sf.model;

import java.math.BigDecimal;
import java.util.Calendar;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/** Model a simple real life payment */
@Entity
@Table(name = "Payment")
/** Enable JSON Serialization with Hibernate persisted objects */
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private int parentId;
	private Calendar date;
	private String counterparty;
	private String meanOfPayment;
	private boolean hasInvoice;

	@Column(name = "amount", columnDefinition = "Decimal(15,4) default '0.00'")
	private BigDecimal amount;
	private String taxCode;
	private String currency;
	private String title;
	private String description;

	protected Payment() {
	}

	public Payment(Calendar date, BigDecimal amount, String counterparty, String title) {
		this.date = date;
		this.amount = amount;
		this.counterparty = counterparty;
		this.title = title;
		currency = "EUR";
	}

	public String toString() {
		return String.format("Payment[id=%d, amount=%s %.2f, cp='%s', date=%5$tY-%5$tm-%5$te]", id, currency, amount,
				counterparty, date);
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public int getParentId() {
		return parentId;
	}

	public void setParentId(int parentId) {
		this.parentId = parentId;
	}

	public Calendar getDate() {
		return date;
	}

	public void setDate(Calendar date) {
		this.date = date;
	}

	public String getCounterparty() {
		return counterparty;
	}

	public void setCounterparty(String counterparty) {
		this.counterparty = counterparty;
	}

	public String getMeanOfPayment() {
		return meanOfPayment;
	}

	public void setMeanOfPayment(String meanOfPayment) {
		this.meanOfPayment = meanOfPayment;
	}

	public boolean isHasInvoice() {
		return hasInvoice;
	}

	public void setHasInvoice(boolean hasInvoice) {
		this.hasInvoice = hasInvoice;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public String getTaxCode() {
		return taxCode;
	}

	public void setTaxCode(String taxCode) {
		this.taxCode = taxCode;
	}

	public String getCurrency() {
		return currency;
	}

	public void setCurrency(String currency) {
		this.currency = currency;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
}
