import React from 'react';
import type { PayoffInput, PayoffResult } from '../logic/payoffCalculations';

interface ScenarioControlsProps {
    values: PayoffInput;
    result: PayoffResult;
    onChange: (field: keyof PayoffInput, value: number | string) => void;
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(val);
};

export const ScenarioControls: React.FC<ScenarioControlsProps> = ({ values, result, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof PayoffInput, parseFloat(value) || 0);
    };

    const showSavings = values.paymentType !== 'minimum' && result.interestSavings > 0;

    return (
        <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Payment Options</h3>

            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>

                {/* Minimum Payment Percent */}
                <div>
                    <label htmlFor="minimumPaymentPercent">Minimum Payment Rate (%)</label>
                    <input
                        id="minimumPaymentPercent"
                        name="minimumPaymentPercent"
                        type="number"
                        step="0.5"
                        value={values.minimumPaymentPercent || ''}
                        onChange={handleChange}
                        placeholder="2"
                    />
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Typical range: 2-3% of balance
                    </p>
                </div>

                {/* Savings vs Minimum */}
                {showSavings && (
                    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                        <div style={{ fontSize: '0.875rem', color: '#065F46', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                            Estimated Savings vs Minimum Payment
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#047857' }}>Interest Saved</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#065F46' }}>
                                    {formatCurrency(result.interestSavings)}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#047857' }}>Time Saved</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#065F46' }}>
                                    {result.timeSavings} months
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
