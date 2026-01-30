export interface PayoffInput {
    balance: number;
    apr: number; // Annual percentage rate
    paymentType: 'minimum' | 'fixed' | 'timeline';
    minimumPaymentPercent: number; // Typically 2-3% of balance
    fixedPayment: number; // Custom fixed monthly payment
    targetMonths: number; // For timeline-based calculation
}

export interface PayoffResult {
    monthlyPayment: number;
    totalInterest: number;
    totalPayment: number;
    monthsToPayoff: number;
    yearsToPayoff: number;
    minimumPaymentAmount: number;
    interestSavings: number; // vs minimum payment
    timeSavings: number; // months saved vs minimum
    // Minimum payment scenario details for comparison
    minPaymentMonths: number;
    minPaymentTotalInterest: number;
    minPaymentTotalPaid: number;
}

export function calculatePayoff(input: PayoffInput): PayoffResult {
    const monthlyRate = input.apr / 100 / 12;

    // Calculate minimum payment (typically 2% of balance or $25, whichever is greater)
    const minimumPaymentAmount = Math.max(
        input.balance * (input.minimumPaymentPercent / 100),
        25
    );

    let monthlyPayment: number;

    // Determine monthly payment based on strategy
    if (input.paymentType === 'minimum') {
        monthlyPayment = minimumPaymentAmount;
    } else if (input.paymentType === 'fixed') {
        monthlyPayment = Math.max(input.fixedPayment, minimumPaymentAmount);
    } else {
        // Timeline-based: calculate payment needed to pay off in target months
        if (monthlyRate === 0) {
            monthlyPayment = input.balance / input.targetMonths;
        } else {
            const factor = Math.pow(1 + monthlyRate, input.targetMonths);
            monthlyPayment = input.balance * (monthlyRate * factor) / (factor - 1);
        }
        monthlyPayment = Math.max(monthlyPayment, minimumPaymentAmount);
    }

    // Simulate payoff with chosen payment
    const { months: monthsToPayoff, totalInterest, totalPayment } = simulatePayoff(
        input.balance,
        monthlyRate,
        monthlyPayment,
        input.minimumPaymentPercent
    );

    // Calculate minimum payment scenario for comparison
    const minPaymentResult = simulatePayoff(
        input.balance,
        monthlyRate,
        minimumPaymentAmount,
        input.minimumPaymentPercent
    );

    const interestSavings = Math.max(0, minPaymentResult.totalInterest - totalInterest);
    const timeSavings = Math.max(0, minPaymentResult.months - monthsToPayoff);

    return {
        monthlyPayment,
        totalInterest,
        totalPayment,
        monthsToPayoff,
        yearsToPayoff: monthsToPayoff / 12,
        minimumPaymentAmount,
        interestSavings,
        timeSavings,
        minPaymentMonths: minPaymentResult.months,
        minPaymentTotalInterest: minPaymentResult.totalInterest,
        minPaymentTotalPaid: minPaymentResult.totalPayment
    };
}

function simulatePayoff(
    balance: number,
    monthlyRate: number,
    payment: number,
    minPaymentPercent: number
): { months: number; totalInterest: number; totalPayment: number } {
    let remainingBalance = balance;
    let totalInterest = 0;
    let totalPayment = 0;
    let months = 0;
    const maxMonths = 600; // 50 year cap to prevent infinite loops

    while (remainingBalance > 0.01 && months < maxMonths) {
        // Calculate interest for this month
        const interestCharge = remainingBalance * monthlyRate;
        totalInterest += interestCharge;

        // For minimum payment strategy, recalculate each month
        const minPayment = Math.max(remainingBalance * (minPaymentPercent / 100), 25);
        const actualPayment = Math.min(Math.max(payment, minPayment), remainingBalance + interestCharge);

        totalPayment += actualPayment;
        remainingBalance = remainingBalance + interestCharge - actualPayment;
        months++;

        // Safety: if payment doesn't cover interest, break
        if (actualPayment <= interestCharge && remainingBalance >= balance) {
            months = maxMonths;
            break;
        }
    }

    return { months, totalInterest, totalPayment };
}
