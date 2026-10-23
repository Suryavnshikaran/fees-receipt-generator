// Global Application Data Store
let currentReceiptData = null;

// Auto-calculate total fees and update Amount Paid field & Preview QR amount dynamically
const feeInputIds = ['tuitionFee', 'examFee', 'transportFee', 'lateFee'];

feeInputIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener('input', calculateTotalAmount);
    }
});

function calculateTotalAmount() {
    const tuition = parseFloat(document.getElementById('tuitionFee').value) || 0;
    const exam = parseFloat(document.getElementById('examFee').value) || 0;
    const transport = parseFloat(document.getElementById('transportFee').value) || 0;
    const late = parseFloat(document.getElementById('lateFee').value) || 0;
    
    const totalSum = tuition + exam + transport + late;
    document.getElementById('amountPaid').value = totalSum;
    
    // Update live QR display amount in preview
    document.getElementById('previewQrAmount').innerText = '₹' + totalSum;
}

// Window load event to initialize calculations
window.addEventListener('DOMContentLoaded', () => {
    calculateTotalAmount();
});

// Helper function to process and display receipt data
function processReceiptGeneration() {
    const tuitionFee = parseFloat(document.getElementById('tuitionFee').value) || 0;
    const examFee = parseFloat(document.getElementById('examFee').value) || 0;
    const transportFee = parseFloat(document.getElementById('transportFee').value) || 0;
    const lateFee = parseFloat(document.getElementById('lateFee').value) || 0;
    
    const totalAmount = tuitionFee + examFee + transportFee + lateFee;
    const amountPaid = parseFloat(document.getElementById('amountPaid').value) || 0;
    const balanceDue = totalAmount - amountPaid;

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);

    const randomReceiptNo = 'VU/2026/' + Math.floor(1000 + Math.random() * 9000);
    const paymentMethod = document.getElementById('paymentMethod').value;

    currentReceiptData = {
        receiptNo: randomReceiptNo,
        date: currentDate,
        studentName: document.getElementById('studentName').value,
        rollNo: document.getElementById('rollNo').value,
        course: document.getElementById('course').value,
        semester: document.getElementById('semester').value,
        paymentMethod: paymentMethod,
        feesBreakdown: { tuitionFee, examFee, transportFee, lateFee },
        totalAmount,
        amountPaid,
        balanceDue,
        status: balanceDue <= 0 ? 'PAID' : 'PARTIAL'
    };

    // Render UI Screen Display
    document.getElementById('rNo').innerText = currentReceiptData.receiptNo;
    document.getElementById('rDate').innerText = currentReceiptData.date;
    document.getElementById('rName').innerText = currentReceiptData.studentName;
    document.getElementById('rRoll').innerText = currentReceiptData.rollNo;
    document.getElementById('rCourse').innerText = currentReceiptData.course;
    document.getElementById('rSem').innerText = currentReceiptData.semester;
    document.getElementById('rMode').innerText = currentReceiptData.paymentMethod;

    document.getElementById('rTuition').innerText = '₹' + currentReceiptData.feesBreakdown.tuitionFee;
    document.getElementById('rExam').innerText = '₹' + currentReceiptData.feesBreakdown.examFee;
    document.getElementById('rTransport').innerText = '₹' + currentReceiptData.feesBreakdown.transportFee;
    document.getElementById('rLate').innerText = '₹' + currentReceiptData.feesBreakdown.lateFee;

    document.getElementById('rTotal').innerText = '₹' + currentReceiptData.totalAmount;
    document.getElementById('rPaid').innerText = '₹' + currentReceiptData.amountPaid;
    document.getElementById('rBalance').innerText = '₹' + currentReceiptData.balanceDue;

    const statusBadge = document.getElementById('rStatus');
    statusBadge.innerText = currentReceiptData.status;
    statusBadge.style.backgroundColor = (currentReceiptData.status === 'PAID') ? '#28a745' : '#e67e22';

    // Render Print Export Container
    document.querySelectorAll('.pdfRNo').forEach(el => el.innerText = currentReceiptData.receiptNo);
    document.querySelectorAll('.pdfRDate').forEach(el => el.innerText = currentReceiptData.date);
    document.querySelectorAll('.pdfRName').forEach(el => el.innerText = currentReceiptData.studentName);
    document.querySelectorAll('.pdfRRoll').forEach(el => el.innerText = currentReceiptData.rollNo);
    document.querySelectorAll('.pdfRCourse').forEach(el => el.innerText = currentReceiptData.course);
    document.querySelectorAll('.pdfRSem').forEach(el => el.innerText = currentReceiptData.semester);
    document.querySelectorAll('.pdfRMode').forEach(el => el.innerText = currentReceiptData.paymentMethod);

    document.querySelectorAll('.pdfRTuition').forEach(el => el.innerText = currentReceiptData.feesBreakdown.tuitionFee);
    document.querySelectorAll('.pdfRExam').forEach(el => el.innerText = currentReceiptData.feesBreakdown.examFee);
    document.querySelectorAll('.pdfRTransport').forEach(el => el.innerText = currentReceiptData.feesBreakdown.transportFee);
    document.querySelectorAll('.pdfRLate').forEach(el => el.innerText = currentReceiptData.feesBreakdown.lateFee);
    document.querySelectorAll('.pdfRTotal').forEach(el => el.innerText = currentReceiptData.totalAmount);
    document.querySelectorAll('.pdfRPaid').forEach(el => el.innerText = currentReceiptData.amountPaid);
    document.querySelectorAll('.pdfRBalance').forEach(el => el.innerText = currentReceiptData.balanceDue);

    document.querySelectorAll('.pdfRStatus').forEach(el => {
        el.innerText = currentReceiptData.status;
        el.style.backgroundColor = (currentReceiptData.status === 'PAID') ? '#28a745' : '#e67e22';
    });
}

// Form Submit -> If Cash, generate receipt directly. If UPI/QR, show QR and "Receipt" button.
document.getElementById('receiptForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const paymentMethod = document.getElementById('paymentMethod').value;
    const previewQrContainer = document.getElementById('previewQrContainer');
    const receiptBox = document.getElementById('receiptBox');
    const placeholderText = document.getElementById('placeholderText');

    placeholderText.classList.add('hidden');

    if (paymentMethod === 'UPI/QR') {
        // Show QR and "Receipt" button first
        previewQrContainer.classList.remove('hidden');
        receiptBox.classList.add('hidden');
    } else {
        // Cash payment -> Generate receipt immediately
        previewQrContainer.classList.add('hidden');
        processReceiptGeneration();
        receiptBox.classList.remove('hidden');
    }
});

// When user clicks the "Receipt" button under QR code
document.getElementById('generateReceiptBtn').addEventListener('click', function () {
    processReceiptGeneration();
    document.getElementById('previewQrContainer').classList.add('hidden');
    document.getElementById('receiptBox').classList.remove('hidden');
});

// Print Receipt Handler
document.getElementById('printBtn').addEventListener('click', function () {
    window.print();
});

// Reset Button Handler
document.getElementById('resetBtn').addEventListener('click', function () {
    document.getElementById('receiptForm').reset();
    calculateTotalAmount();
    document.getElementById('previewQrContainer').classList.add('hidden');
    document.getElementById('receiptBox').classList.add('hidden');
    document.getElementById('placeholderText').classList.remove('hidden');
    currentReceiptData = null;
});