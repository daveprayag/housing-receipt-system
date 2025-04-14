import { PDFDocument, rgb, StandardFonts, PDFFont, Color } from "pdf-lib";

export async function generateReceiptPDF(data: {
    receipt_no: string;
    owner_name: string;
    house_number: string;
    date: string;
    amount_number: string;
    amount_words: string;
    transaction_mode: string;
    reason: string;
}): Promise<Blob> {
    // Create document with better dimensions for a receipt
    const pdfDoc = await PDFDocument.create();
    const pageWidth = 450;
    const pageHeight = 500;
    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Define colors for better visual appeal
    const primaryColor = rgb(0.05, 0.3, 0.6); // Deep blue
    const secondaryColor = rgb(0.7, 0.1, 0.1); // Deep red
    const accentColor = rgb(0.95, 0.95, 1); // Light blue for backgrounds
    const textColor = rgb(0.15, 0.15, 0.15); // Near black for text

    // Load fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Initial position
    let y = pageHeight - 50;
    const margin = 25;

    // Add decorative border to the page
    page.drawRectangle({
        x: 10,
        y: 10,
        width: pageWidth - 20,
        height: pageHeight - 20,
        borderColor: primaryColor,
        borderWidth: 1.5,
        opacity: 0.8,
    });

    // Header with background
    page.drawRectangle({
        x: 0,
        y: pageHeight - 80,
        width: pageWidth,
        height: 80,
        color: accentColor,
    });

    // Society name and title
    y = pageHeight - 40;

    const titleText = "PRANAM COMPLEX FLAT OWNERS' ASSOCIATION";
    const titleWidth = boldFont.widthOfTextAtSize(titleText, 16);
    page.drawText(titleText, {
        x: (pageWidth - titleWidth) / 1.2,
        y,
        size: 14,
        font: boldFont,
        color: primaryColor,
    });

    y -= 15;

    const addressText = "Urmi-Dinesh Mill Road, Vadodara - 390007";
    const addressWidth = italicFont.widthOfTextAtSize(addressText, 10);
    page.drawText(addressText, {
        x: (pageWidth - addressWidth) / 2,
        y,
        size: 10,
        font: italicFont,
        color: textColor,
    });

    y -= 50;

    const receiptText = "PAYMENT RECEIPT";
    const receiptWidth = boldFont.widthOfTextAtSize(receiptText, 14);
    page.drawText(receiptText, {
        x: (pageWidth - receiptWidth) / 2,
        y,
        size: 14,
        font: boldFont,
        color: secondaryColor,
    });

    y -= 30;

    // Receipt No and Date - MOVED OUTSIDE the box
    page.drawText("Receipt No:", {
        x: margin,
        y,
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    page.drawText(String(data.receipt_no), {
        x: margin + 70,
        y,
        size: 10,
        font: boldFont,
        color: textColor,
    });

    page.drawText("Date:", {
        x: pageWidth - margin - 100,
        y,
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    page.drawText(String(data.date), {
        x: pageWidth - margin - 65,
        y,
        size: 10,
        font: boldFont,
        color: textColor,
    });

    y -= 10; // Space after receipt number and date

    // Owner info section with smaller height
    const ownerInfoY = y;
    const ownerInfoHeight = 40; // Reduced height for this box

    page.drawRectangle({
        x: margin - 5,
        y: ownerInfoY - ownerInfoHeight,
        width: pageWidth - margin * 2 + 10,
        height: ownerInfoHeight,
        color: rgb(0.97, 0.97, 1),
        borderColor: rgb(0.8, 0.8, 0.9),
        borderWidth: 0.5,
        opacity: 0.8,
    });

    // Owner info
    page.drawText("Received From:", {
        x: margin,
        y: ownerInfoY - 15,
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    page.drawText(String(data.owner_name), {
        x: margin + 90,
        y: ownerInfoY - 15,
        size: 10,
        font: boldFont,
        color: textColor,
    });

    // House Number with less space
    page.drawText("House Number:", {
        x: margin,
        y: ownerInfoY - 30, // Closer to the "Received From" line
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    page.drawText(String(data.house_number), {
        x: margin + 90,
        y: ownerInfoY - 30,
        size: 10,
        font: boldFont,
        color: textColor,
    });

    y = ownerInfoY - ownerInfoHeight - 20; // Space after owner info box

    // Amount in words section
    page.drawText("Amount (in words):", {
        x: margin,
        y,
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    y -= 25; // More space for amount in words box

    // Draw a light background for the amount in words
    const wordsY = y;
    page.drawRectangle({
        x: margin + 10,
        y: wordsY - 5,
        width: pageWidth - margin * 2 - 20,
        height: 25,
        color: rgb(0.95, 0.98, 1),
        borderColor: rgb(0.7, 0.8, 0.9),
        borderWidth: 0.5,
    });

    // Center the amount in words
    const wordsWidth = italicFont.widthOfTextAtSize(
        String(data.amount_words),
        11
    );
    page.drawText(String(data.amount_words), {
        x: (pageWidth - wordsWidth) / 2,
        y: wordsY + 5,
        size: 11,
        font: italicFont,
        color: secondaryColor,
    });

    y -= 45; // More space before amount box

    // Boxed numeric amount with better styling
    const boxWidth = 150;
    const boxHeight = 40;
    const boxX = (pageWidth - boxWidth) / 2;
    const boxY = y - 10;

    // Drop shadow effect
    page.drawRectangle({
        x: boxX + 3,
        y: boxY - 3,
        width: boxWidth,
        height: boxHeight,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3,
    });

    // Main amount box
    page.drawRectangle({
        x: boxX,
        y: boxY,
        width: boxWidth,
        height: boxHeight,
        color: rgb(0.98, 0.98, 1),
        borderColor: primaryColor,
        borderWidth: 1.5,
    });

    // Add a header to the box
    page.drawRectangle({
        x: boxX,
        y: boxY + boxHeight - 15,
        width: boxWidth,
        height: 15,
        color: accentColor,
        borderColor: primaryColor,
        borderWidth: 0,
    });

    // Box header text
    const boxHeaderText = "AMOUNT";
    const boxHeaderWidth = boldFont.widthOfTextAtSize(boxHeaderText, 9);
    page.drawText(boxHeaderText, {
        x: boxX + (boxWidth - boxHeaderWidth) / 2,
        y: boxY + boxHeight - 10,
        size: 9,
        font: boldFont,
        color: primaryColor,
    });

    // Amount value
    const amountText = `Rs. ${String(data.amount_number)}`;
    const amountFontSize = 16;
    const amountTextWidth = boldFont.widthOfTextAtSize(
        amountText,
        amountFontSize
    );
    const amountX = boxX + (boxWidth - amountTextWidth) / 2;

    page.drawText(amountText, {
        x: amountX,
        y: boxY + 8,
        size: amountFontSize,
        font: boldFont,
        color: secondaryColor,
    });

    // Payment details section - positioned properly
    y = boxY - 30;

    // Single payment details box with proper height
    const paymentDetailsY = y;
    const paymentDetailsHeight = 50;

    page.drawRectangle({
        x: margin - 5,
        y: paymentDetailsY - paymentDetailsHeight,
        width: pageWidth - margin * 2 + 10,
        height: paymentDetailsHeight,
        color: rgb(0.97, 0.97, 1),
        borderColor: rgb(0.8, 0.8, 0.9),
        borderWidth: 0.5,
        opacity: 0.8,
    });

    // Payment details - all in one box with proper spacing
    page.drawText("Payment For:", {
        x: margin,
        y: paymentDetailsY - 15,
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    page.drawText(String(data.reason), {
        x: margin + 85,
        y: paymentDetailsY - 15,
        size: 10,
        font: boldFont,
        color: textColor,
    });

    page.drawText("Transaction Mode:", {
        x: margin,
        y: paymentDetailsY - 30,
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    page.drawText(String(data.transaction_mode), {
        x: margin + 115,
        y: paymentDetailsY - 30,
        size: 10,
        font: boldFont,
        color: textColor,
    });

    // Received By section inside the same box
    page.drawText("Received By:", {
        x: margin,
        y: paymentDetailsY - 45,
        size: 10,
        font: boldFont,
        color: primaryColor,
    });

    page.drawText("Kashyap Dave (Secretary)", {
        x: margin + 85,
        y: paymentDetailsY - 45,
        size: 10,
        font: boldFont,
        color: textColor,
    });

    // Footer
    page.drawRectangle({
        x: 0,
        y: 0,
        width: pageWidth,
        height: 25,
        color: accentColor,
    });

    // Signature section with proper spacing
    const signLineY = paymentDetailsY - paymentDetailsHeight - 40;
    const signStartX = pageWidth - margin - 120;

    // Load and embed the signature image
    const imageUrl = "/signature.png"; // Public folder path
    const response = await fetch(imageUrl);
    const signatureImageBytes = await response.arrayBuffer(); // Important: use arrayBuffer()
    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);

    const signatureWidth = 80;
    const signatureHeight = 30;

    page.drawImage(signatureImage, {
        x: signStartX + 15,
        y: signLineY - 10 + 2, // Slightly above the line
        width: signatureWidth,
        height: signatureHeight,
    });

    // Signature line just above label
    page.drawLine({
        start: { x: signStartX, y: signLineY - 10 },
        end: { x: signStartX + 110, y: signLineY - 10 },
        thickness: 1,
        color: primaryColor,
    });

    // Signature label stays where it is
    page.drawText("Authorized Signature", {
        x: signStartX + 15,
        y: signLineY - 25,
        size: 9,
        font: italicFont,
        color: primaryColor,
    });

    // Add a thank you note at the bottom
    const thankYouText = "Thank you for your payment!";
    const thankYouWidth = italicFont.widthOfTextAtSize(thankYouText, 10);
    page.drawText(thankYouText, {
        x: (pageWidth - thankYouWidth) / 2,
        y: 30,
        size: 10,
        font: italicFont,
        color: primaryColor,
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
}
