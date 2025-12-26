import Link from 'next/link';

export default function OrderSuccessPage() {
    const orderNumber = 'ORD-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold mb-2">Buyurtma qabul qilindi! 🎉</h1>
                    <p className="text-gray-500 mb-6">
                        Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada siz bilan bog'lanamiz.
                    </p>

                    {/* Order Number */}
                    <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-1">Buyurtma raqami</p>
                        <p className="text-xl font-bold text-violet-600">{orderNumber}</p>
                    </div>

                    {/* Timeline */}
                    <div className="text-left mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-violet-600 text-white rounded-full flex items-center justify-center text-sm">1</div>
                            <div>
                                <p className="font-medium">Buyurtma qabul qilindi</p>
                                <p className="text-sm text-gray-500">Hozir</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-4 opacity-50">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-sm">2</div>
                            <div>
                                <p className="font-medium">Tayyorlanmoqda</p>
                                <p className="text-sm text-gray-500">1-2 soat</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 opacity-50">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center text-sm">3</div>
                            <div>
                                <p className="font-medium">Yetkazib berilmoqda</p>
                                <p className="text-sm text-gray-500">1-3 kun</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Link href="/profile?tab=orders" className="btn btn-primary">
                            Buyurtmalarni ko'rish
                        </Link>
                        <Link href="/" className="btn btn-secondary">
                            Bosh sahifaga
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
