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

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ result, balance }) => {
    const paymentRows = [
        { label: 'Estimated Monthly Payment', value: formatMoney(result.monthlyPayment), isTotal: false },
        { label: 'Estimated Minimum Payment', value: formatMoney(result.minimumPaymentAmount), isTotal: false },
    ];

    const totalRows = [
        { label: 'Starting Balance', value: formatMoney(balance), isTotal: false },
        { label: 'Estimated Total Interest', value: formatMoney(result.totalInterest), isTotal: false },
        { label: 'Estimated Total Amount Paid', value: formatMoney(result.totalPayment), isTotal: true },
    ];

    const timeRows = [
        { label: 'Estimated Time to Pay Off', value: formatTime(result.monthsToPayoff), isTotal: false },
        { label: 'Total Months', value: `${Math.round(result.monthsToPayoff)} months`, isTotal: false },
    ];

    return (
        <div className="card" style={{ padding: '0' }}>
            {/* Payment Section */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: '1rem' }}>Estimated Payment Details</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                <tbody>
                    {paymentRows.map((row, idx) => (
                        <tr key={idx} style={{
                            borderBottom: '1px solid var(--color-border)',
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

            {/* Total Cost Section */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)', background: '#F8FAFC' }}>
                <h3 style={{ fontSize: '1rem' }}>Estimated Total Costs</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                <tbody>
                    {totalRows.map((row, idx) => (
                        <tr key={idx} style={{
                            borderBottom: '1px solid var(--color-border)',
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

            {/* Time Section */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)', borderTop: '1px solid var(--color-border)', background: '#F8FAFC' }}>
                <h3 style={{ fontSize: '1rem' }}>Estimated Payoff Timeline</h3>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                <tbody>
                    {timeRows.map((row, idx) => (
                        <tr key={idx} style={{
                            borderBottom: idx === timeRows.length - 1 ? 'none' : '1px solid var(--color-border)',
                            backgroundColor: idx % 2 === 0 ? 'transparent' : '#F8FAFC'
                        }}>
                            <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>
                                {row.label}
                            </td>
                            <td style={{
                                padding: 'var(--space-3) var(--space-6)',
                                textAlign: 'right',
                                fontWeight: 500,
                                color: 'var(--color-text-primary)'
                            }}>
                                {row.value}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
