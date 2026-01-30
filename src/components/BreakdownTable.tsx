import React from 'react';
import type { PayoffResult } from '../logic/payoffCalculations';

interface BreakdownTableProps {
    result: PayoffResult;
    balance: number;
}

const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val);
};

const formatTime = (months: number) => {
    if (months >= 600) return '50+ years';
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} years`;
    return `${years} years, ${remainingMonths} months`;
};

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ result, balance: _balance }) => {
    // Current payment scenario
    const currentRows = [
        { label: 'Estimated Monthly Payment', value: formatMoney(result.monthlyPayment), isTotal: false },
        { label: 'Estimated Time to Pay Off', value: formatTime(result.monthsToPayoff), isTotal: false },
        { label: 'Estimated Total Interest', value: formatMoney(result.totalInterest), isTotal: false },
        { label: 'Estimated Total Amount Paid', value: formatMoney(result.totalPayment), isTotal: true },
    ];

    // Minimum payment scenario for comparison
    const minimumRows = [
        { label: 'Estimated Minimum Payment', value: formatMoney(result.minimumPaymentAmount), isTotal: false },
        { label: 'Estimated Time to Pay Off', value: formatTime(result.minPaymentMonths), isTotal: false },
        { label: 'Estimated Total Interest', value: formatMoney(result.minPaymentTotalInterest), isTotal: false },
        { label: 'Estimated Total Amount Paid', value: formatMoney(result.minPaymentTotalPaid), isTotal: true },
    ];

    // Potential savings (only show if paying more than minimum)
    const hasSavings = result.interestSavings > 0 || result.timeSavings > 0;
    const savingsRows = hasSavings ? [
        { label: 'Estimated Interest Savings', value: formatMoney(result.interestSavings), isTotal: false },
        { label: 'Estimated Time Savings', value: `${Math.round(result.timeSavings)} months`, isTotal: false },
    ] : [];

    const renderTable = (rows: Array<{ label: string; value: string; isTotal: boolean }>, isLast = false) => (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
            <tbody>
                {rows.map((row, idx) => (
                    <tr key={idx} style={{
                        borderBottom: (isLast && idx === rows.length - 1) ? 'none' : '1px solid var(--color-border)',
                        backgroundColor: idx % 2 === 0 ? 'transparent' : '#F8FAFC'
                    }}>
                        <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>
                            {row.label}
                        </td>
                        <td style={{
                            padding: 'var(--space-3) var(--space-6)',
                            textAlign: 'right',
                            fontWeight: row.isTotal ? 700 : 400,
                            color: row.isTotal ? 'var(--color-primary)' : 'inherit'
                        }}>
                            {row.value}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="card" style={{ padding: '0' }}>
            {/* Current Payment Scenario */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1rem' }}>Your Estimated Payment Scenario</h3>
            </div>
            {renderTable(currentRows)}

            {/* Minimum Payment Scenario */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)', background: '#F8FAFC' }}>
                <h3 style={{ fontSize: '1rem' }}>Minimum Payment Scenario</h3>
            </div>
            {renderTable(minimumRows, !hasSavings)}

            {/* Potential Savings (conditional) */}
            {hasSavings && (
                <>
                    <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)', background: '#F0FDF4' }}>
                        <h3 style={{ fontSize: '1rem', color: '#166534' }}>Estimated Savings vs. Minimum Payment</h3>
                    </div>
                    {renderTable(savingsRows, true)}
                </>
            )}

            {/* Disclaimer */}
            <div style={{ padding: 'var(--space-3) var(--space-6)', borderTop: '1px solid var(--color-border)', background: '#F8FAFC' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', margin: 0 }}>
                    All values are estimates only. Actual results may vary based on your specific terms and payment behavior.
                </p>
            </div>
        </div>
    );
};
