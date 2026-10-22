const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to generate receipt calculations
app.post('/api/generate-receipt', (req, res) => {
    try {
        const {
            studentName,
            rollNo,
            course,
            semester,
            paymentMethod,
            tuitionFee,
            examFee,
            transportFee,
            lateFee,
            amountPaid
        } = req.body;

        const tFee = parseFloat(tuitionFee) || 0;
        const eFee = parseFloat(examFee) || 0;
        const trFee = parseFloat(transportFee) || 0;
        const lFee = parseFloat(lateFee) || 0;
        const paid = parseFloat(amountPaid) || 0;

        const totalAmount = tFee + eFee + trFee + lFee;
        const balanceDue = totalAmount - paid;
        const status = balanceDue <= 0 ? 'PAID' : 'PARTIAL / PENDING';

        const receiptNo = 'VU/' + new Date().getFullYear() + '/' + Math.floor(1000 + Math.random() * 9000);
        const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        res.json({
            success: true,
            receipt: {
                receiptNo,
                date,
                studentName,
                rollNo,
                course,
                semester,
                paymentMethod,
                feesBreakdown: {
                    tuitionFee: tFee.toLocaleString('en-IN'),
                    examFee: eFee.toLocaleString('en-IN'),
                    transportFee: trFee.toLocaleString('en-IN'),
                    lateFee: lFee.toLocaleString('en-IN')
                },
                totalAmount: totalAmount.toLocaleString('en-IN'),
                amountPaid: paid.toLocaleString('en-IN'),
                balanceDue: balanceDue.toLocaleString('en-IN'),
                status
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});