import React from 'react';
import type { PayoffInput } from '../logic/payoffCalculations';

interface InputCardProps {
    values: PayoffInput;
    onChange: (field: keyof PayoffInput, value: number | string) => void;
}

export const InputCard: React.FC<InputCardProps> = ({ values, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'paymentType') {
            onChange(name as keyof PayoffInput, value);
        } else {
            onChange(name as keyof PayoffInput, parseFloat(value) || 0);
        }
    };

    return (
        <div className="card">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>

                {/* Current Balance */}
                <div>
                    <label htmlFor="balance">Current Balance</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                        <input
                            id="balance"
                            name="balance"
                            type="number"
                            value={values.balance || ''}
                            onChange={handleChange}
                            placeholder="0"
                            style={{ paddingLeft: '28px', fontSize: '1.25rem', fontWeight: 600 }}
                        />
                    </div>
                </div>

                {/* APR */}
                <div>
                    <label htmlFor="apr">Annual Interest Rate (APR %)</label>
                    <input
                        id="apr"
                        name="apr"
                        type="number"
                        step="0.1"
                        value={values.apr || ''}
                        onChange={handleChange}
                        placeholder="18.99"
                    />
                </div>

                {/* Payment Strategy */}
                <div>
                    <label htmlFor="paymentType">Payment Strategy</label>
                    <select
                        id="paymentType"
                        name="paymentType"
                        value={values.paymentType}
                        onChange={handleChange}
                    >
                        <option value="minimum">Minimum Payment Only</option>
                        <option value="fixed">Fixed Monthly Payment</option>
                        <option value="timeline">Pay Off by Target Date</option>
                    </select>
                </div>

                {/* Conditional: Fixed Payment Amount */}
                {values.paymentType === 'fixed' && (
                    <div>
                        <label htmlFor="fixedPayment">Monthly Payment Amount</label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }}>$</span>
                            <input
                                id="fixedPayment"
                                name="fixedPayment"
                                type="number"
                                value={values.fixedPayment || ''}
                                onChange={handleChange}
                                placeholder="0"
                                style={{ paddingLeft: '28px' }}
                            />
                        </div>
                    </div>
                )}

                {/* Conditional: Target Months */}
                {values.paymentType === 'timeline' && (
                    <div>
                        <label htmlFor="targetMonths">Target Payoff (Months)</label>
                        <select
                            id="targetMonths"
                            name="targetMonths"
                            value={values.targetMonths}
                            onChange={handleChange}
                        >
                            <option value="12">12 Months (1 Year)</option>
                            <option value="24">24 Months (2 Years)</option>
                            <option value="36">36 Months (3 Years)</option>
                            <option value="48">48 Months (4 Years)</option>
                            <option value="60">60 Months (5 Years)</option>
                        </select>
                    </div>
                )}

                {/* Calculate Button */}
                <button className="btn-primary" type="button">
                    Calculate
                </button>

            </div>
        </div>
    );
};
