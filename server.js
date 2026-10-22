const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory database array
let receiptsDatabase = [];

// API Endpoint: Generate Receipt Data
app.post('/api/generate-receipt', (req, res) => {
    try {
        const { studentName, rollNo, course, semester, tuitionFee, examFee, transportFee, lateFee, amountPaid, paymentMethod } = req.body;

        // Validation
        if (!studentName || !rollNo || !course || !semester) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
        }

        // Calculations
        const totalAmount = Number(tuitionFee || 0) + Number(examFee || 0) + Number(transportFee || 0) + Number(lateFee || 0);
        const paid = Number(amountPaid || 0);
        const balance = totalAmount - paid;

        // Generate Unique Receipt Number
        const receiptNo = 'REC-' + Date.now().toString().slice(-6) + Math.floor(1000 + Math.random() * 9000);
        const currentDate = new Date().toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });

        const newReceipt = {
            receiptNo,
            date: currentDate,
            studentName,
            rollNo,
            course,
            semester,
            feesBreakdown: {
                tuitionFee: Number(tuitionFee || 0),
                examFee: Number(examFee || 0),
                transportFee: Number(transportFee || 0),
                lateFee: Number(lateFee || 0)
            },
            totalAmount,
            amountPaid: paid,
            balanceDue: balance > 0 ? balance : 0,
            paymentMethod: paymentMethod || 'Cash',
            status: balance <= 0 ? 'PAID' : 'PARTIALLY PAID'
        };

        receiptsDatabase.push(newReceipt);

        res.status(200).json({
            success: true,
            message: 'Receipt generated successfully!',
            receipt: newReceipt
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error occurred.' });
    }
});

// API Endpoint: Get all receipts history
app.get('/api/receipts', (req, res) => {
    res.status(200).json({ success: true, receipts: receiptsDatabase });
});

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
});