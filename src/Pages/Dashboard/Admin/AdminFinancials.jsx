import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import {
  FiTrendingUp,
  FiCreditCard,
  FiCornerUpLeft,
  FiSearch,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';
import { FaBangladeshiTakaSign } from 'react-icons/fa6';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const AdminFinancials = () => {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const axiosSecure = useAxiosSecure();

  const fetchFinancialData = async () => {
    try {
      setLoading(true);

      const [statsRes, txRes] = await Promise.all([
        axiosSecure.get('/admin/financials'),
        axiosSecure.get('/admin/transactions/all').catch(() => ({ data: {} }))
      ]);

      const txList = txRes?.data?.transactions || txRes?.data || [];
      setTransactions(Array.isArray(txList) ? txList : []);

      const resData = statsRes?.data || {};
      const rawStats = resData?.stats || resData;

      // Trust the backend's numbers directly — it already sums each payment's own
      // locked-in fee rate, so no recalculation from the transaction list is
      // needed or correct here anymore.
      setStats({
        totalGrossSales: Number(rawStats?.totalGrossSales ?? rawStats?.grossPlatformSales ?? 0),
        totalRefunded: Number(rawStats?.totalRefunded ?? 0),
        platformCommission: Number(rawStats?.platformCommission ?? 0),
        totalPaidOut: Number(rawStats?.totalPaidOut ?? rawStats?.totalPaidOutToTeachers ?? 0),
        currentPlatformFeePercentage: Number(resData?.currentPlatformFeePercentage ?? 0.10)
      });
    } catch (err) {
      toast.error('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const getCourseTitle = (tx) => {
    if (tx?.courseTitle && tx.courseTitle !== 'N/A') return tx.courseTitle;
    if (tx?.title && tx.title !== 'N/A') return tx.title;
    if (tx?.className && tx.className !== 'N/A') return tx.className;
    if (tx?.courseName && tx.courseName !== 'N/A') return tx.courseName;
    if (tx?.metadata?.courseTitle || tx?.metadata?.title || tx?.metadata?.className) {
      return tx.metadata.courseTitle || tx.metadata.title || tx.metadata.className;
    }
    if (Array.isArray(tx?.items) && tx.items.length > 0) {
      return tx.items.map(i => i.title || i.courseTitle || i.name).filter(Boolean).join(', ');
    }
    if (Array.isArray(tx?.courses) && tx.courses.length > 0) {
      return tx.courses.map(c => (typeof c === 'object' ? c.title || c.courseTitle || c.name : c)).filter(Boolean).join(', ');
    }
    return 'General Course Enrollment';
  };

  const filteredTransactions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return transactions;

    return transactions.filter((tx) => {
      const email = (tx.email || tx.userEmail || '').toLowerCase();
      const txId = (tx.transactionId || tx.stripePaymentIntentId || tx._id || '').toLowerCase();
      const course = getCourseTitle(tx).toLowerCase();

      return email.includes(term) || txId.includes(term) || course.includes(term);
    });
  }, [transactions, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="w-8 h-8 border-3 border-[#07A698] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 font-sans text-stone-800">
      <div className="border-b border-stone-200/80 pb-4">
        <h1 className="text-2xl font-black text-[#162726] tracking-tight">Platform Financial Audit & Payments</h1>
        <p className="text-xs text-stone-500 pt-1 font-medium">
          Review sales volume, platform fee commissions, teacher payouts, and process manual transaction refunds.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Gross Platform Sales</p>
            <p className="text-2xl font-black text-stone-900 mt-1 flex items-center gap-0.5">
              <FaBangladeshiTakaSign className="text-xl" />
              <span>{stats?.totalGrossSales !== undefined ? stats.totalGrossSales.toFixed(2) : '0.00'}</span>
            </p>
          </div>
          <div className="p-3 bg-stone-100 rounded-xl text-stone-600 shrink-0">
            <FaBangladeshiTakaSign className="text-xl" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#07A698] uppercase tracking-wider">
              Commission {stats?.currentPlatformFeePercentage !== undefined ? `(current: ${(stats.currentPlatformFeePercentage * 100).toFixed(1)}%)` : ''}
            </p>
            <p className="text-2xl font-black text-[#07A698] mt-1 flex items-center gap-0.5">
              <FaBangladeshiTakaSign className="text-xl" />
              <span>{stats?.platformCommission !== undefined ? stats.platformCommission.toFixed(2) : '0.00'}</span>
            </p>
          </div>
          <div className="p-3 bg-[#07A698]/10 rounded-xl text-[#07A698] shrink-0">
            <FiTrendingUp className="text-xl" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Paid to Teachers</p>
            <p className="text-2xl font-black text-indigo-700 mt-1 flex items-center gap-0.5">
              <FaBangladeshiTakaSign className="text-xl" />
              <span>{stats?.totalPaidOut !== undefined ? stats.totalPaidOut.toFixed(2) : '0.00'}</span>
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 shrink-0">
            <FiCreditCard className="text-xl" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider">Total Refunded</p>
            <p className="text-2xl font-black text-rose-600 mt-1 flex items-center gap-0.5">
              <FaBangladeshiTakaSign className="text-xl" />
              <span>{stats?.totalRefunded !== undefined ? stats.totalRefunded.toFixed(2) : '0.00'}</span>
            </p>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-500 shrink-0">
            <FiCornerUpLeft className="text-xl" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-base font-bold text-[#162726]">All Platform Transactions</h2>
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-3.5 h-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search email, ID, or course..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:border-[#07A698] transition-all shadow-xs"
          />
        </div>
      </div>

      <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="border-b border-stone-200 text-[11px] font-bold text-stone-400 uppercase tracking-wider bg-stone-50">
                <th className="py-3.5 px-4">TX ID / Date</th>
                <th className="py-3.5 px-4">User Email</th>
                <th className="py-3.5 px-4">Course</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Commission</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-stone-400 font-medium">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => {
                  const rawDate = item?.date || item?.createdAt || item?.created || item?.paymentDate || item?.timestamp;
                  let formattedDate = 'N/A';
                  if (rawDate) {
                    const timestamp = typeof rawDate === 'number' && rawDate < 10000000000 ? rawDate * 1000 : rawDate;
                    const parsedDate = new Date(timestamp);
                    if (!isNaN(parsedDate.getTime())) {
                      formattedDate = parsedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    }
                  }

                  const rawAmount = item?.price ?? item?.amount ?? item?.pricePaid ?? item?.totalPrice ?? item?.paymentAmount;
                  const numericAmount = rawAmount !== undefined && rawAmount !== null ? Number(rawAmount) : 0;

                  const courseTitle = getCourseTitle(item);
                  const statusLower = (item?.status || 'completed').toLowerCase();

                  return (
                    <tr key={item._id || item.transactionId} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono text-xs text-stone-700 font-bold truncate max-w-[140px]">
                          {item.transactionId || item.stripePaymentIntentId || item._id}
                        </div>
                        <div className="text-[11px] text-stone-400">{formattedDate}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-stone-700 break-all">
                        {item.email || item.userEmail || 'Guest / Test User'}
                      </td>
                      <td className="py-3.5 px-4 text-stone-600 max-w-[220px] truncate" title={courseTitle}>
                        {courseTitle}
                      </td>
                      <td className="py-3.5 px-4 font-black text-stone-900 whitespace-nowrap">
                        <span className="inline-flex items-center gap-0.5">
                          <FaBangladeshiTakaSign className="text-xs" />
                          <span>{numericAmount.toFixed(2)}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-0.5 font-bold text-[#07A698] text-xs">
                            <FaBangladeshiTakaSign className="text-[10px]" />
                            <span>{Number(item.commissionAmount ?? 0).toFixed(2)}</span>
                          </span>
                          <span className="text-[10px] text-stone-400 font-medium">
                            {item.commissionPercentage ?? 0}%{item.isLegacyFeeRate ? ' (est.)' : ''}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {statusLower === 'completed' || statusLower === 'paid' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FiCheckCircle className="shrink-0" /> Paid
                          </span>
                        ) : statusLower === 'refunded' ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-rose-50 text-rose-700 border border-rose-200">
                              <FiCornerUpLeft className="shrink-0" /> Refunded
                            </span>
                            {item.sslcommerzRefundSucceeded === false && (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 w-fit">
                                <FiClock className="shrink-0" /> Manual action needed
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize bg-amber-50 text-amber-700 border border-amber-200">
                            <FiClock className="shrink-0" /> {item.status || 'Pending'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminFinancials;