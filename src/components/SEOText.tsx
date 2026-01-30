import React from 'react';

export const SEOText: React.FC = () => {
    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
            <p>
                This credit card payoff calculator estimates how long it will take to pay off your balance
                based on your interest rate and monthly payment amount. Compare different payment strategies
                to see potential interest savings. Results are estimates only and actual payoff times may
                vary based on additional charges, rate changes, and payment timing. This tool is for
                informational purposes and not financial advice.
            </p>
        </div>
    );
};
