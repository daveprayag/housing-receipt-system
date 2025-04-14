export type ReceiptData = {
    owner_id: string;
    owner_name: string;
    house_number: string;
    date: string;
    amount_number: string;
    amount_words: string;
    transaction_mode: string;
    reason: string;
    pdf_blob: Blob;
};
