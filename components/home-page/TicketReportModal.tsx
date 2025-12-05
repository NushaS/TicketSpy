// 'use client';

// import React, { useState } from 'react';
// import styles from './TicketReportModal.module.css';
// import { ViolationType } from '@/lib/enums/ticketViolationType';

// interface TicketReportModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (violationType: ViolationType, otherFields?: any) => void;
// }

// const TicketReportModal: React.FC<TicketReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
//   const [ticketViolationType, setTicketViolationType] = useState<ViolationType>(
//     ViolationType.MeterOrTime
//   );

//   if (!isOpen) return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(ticketViolationType);
//     onClose();
//   };

//   return (
//     <div className={styles.modalBackdrop}>
//       <div className={styles.modal}>
//         <button className={styles.closeButton} onClick={onClose}>
//           X
//         </button>
//         <form onSubmit={handleSubmit} className={styles.ticketReportForm}>
//           <div className={styles.ticketReportFormGroup}>
//             <label className={styles.ticketReportLabel}>Ticket Violation Type:</label>
//             <select
//               className={styles.ticketReportInput}
//               value={ticketViolationType}
//               onChange={(e) => setTicketViolationType(e.target.value as ViolationType)}
//               required
//             >
//               {Object.values(ViolationType).map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Add other fields here if needed */}

//           <button type="submit" className={styles.submitButton}>
//             Submit
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default TicketReportModal;

// {
//   /* Ticket Report Modal */
// }
// {
//   showTicketReportModal && (
//     <div className={styles.modalOverlay}>
//       <div className={styles.ticketReportModalContent}>
//         <button
//           onClick={() => {
//             setShowTicketReportModal(false);
//             setTicketDateIssued('');
//             setTicketTimeIssued('');
//             setTicketViolationType('');
//           }}
//           className={styles.ticketReportCloseButton}
//         >
//           <X size={24} />
//         </button>

//         <h2 className={styles.ticketReportTitle}>Report a ticket:</h2>

//         <form
//           onSubmit={async (e) => {
//             e.preventDefault();

//             const ticketData = {
//               latitude: reportLocation?.lat,
//               longitude: reportLocation?.lng,
//               ticket_report_date: ticketDateIssued,
//               ticket_report_hour: ticketTimeIssued,
//               username: username || 'Anonymous',
//               violationType: ticketViolationType,
//             };

//             try {
//               console.log('Submitting ticket data:', ticketData);

//               const response = await fetch('/api/post-ticket', {
//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(ticketData),
//               });

//               console.log('Response status:', response.status);

//               const result = await response.json();
//               console.log('Response data:', result);

//               if (response.ok) {
//                 console.log('Ticket submitted successfully:', result);
//                 // Refresh the heatmap data to show the new ticket
//                 refetchTickets();
//                 // Show success toast
//                 setSuccessMessage('Ticket reported successfully!');
//                 setShowSuccessToast(true);
//                 setTimeout(() => setShowSuccessToast(false), 3000);
//               } else {
//                 console.error('Error submitting ticket:', result);
//                 setErrorMessage(result.error || 'Failed to submit ticket');
//                 setShowErrorToast(true);
//                 setTimeout(() => setShowErrorToast(false), 3000);
//               }
//             } catch (error) {
//               console.error('Network error:', error);
//               setErrorMessage('Network error: Failed to submit ticket');
//               setShowErrorToast(true);
//               setTimeout(() => setShowErrorToast(false), 3000);
//             }

//             setShowTicketReportModal(false);
//             setTicketDateIssued('');
//             setTicketTimeIssued('');
//             setTicketViolationType('');
//             setReportLocation(null);
//           }}
//           className={styles.ticketReportForm}
//         >
//           <div className={styles.ticketReportFormGroup}>
//             <label className={styles.ticketReportLabel}>Date issued:</label>
//             <input
//               type="date"
//               className={styles.ticketReportInput}
//               value={ticketDateIssued}
//               onChange={(e) => setTicketDateIssued(e.target.value)}
//               required
//             />
//           </div>

//           <div className={styles.ticketReportFormGroup}>
//             <label className={styles.ticketReportLabel}>Time issued:</label>
//             <input
//               type="time"
//               className={styles.ticketReportInput}
//               value={ticketTimeIssued}
//               onChange={(e) => setTicketTimeIssued(e.target.value)}
//               required
//             />
//           </div>

//           <div className={styles.ticketReportFormGroup}>
//             <label className={styles.ticketReportLabel}>Violation type:</label>
//             <input
//               type="text"
//               className={styles.ticketReportInput}
//               value={ticketViolationType}
//               onChange={(e) => setTicketViolationType(e.target.value)}
//               required
//             />
//           </div>

//           <div className={styles.ticketReportFormGroup}>
//             <label className={styles.ticketReportLabel}>Ticket Violation Type:</label>
//             <input
//               type="text"
//               className={styles.ticketReportInput}
//               value={ticketViolationType}
//               onChange={(e) => setTicketViolationType(e.target.value)}
//               required
//             />
//             <select id="cars" name="cars">
//               <option value="volvo">Volvo</option>
//               <option value="saab">Saab</option>
//               <option value="fiat">Fiat</option>
//               <option value="audi">Audi</option>
//             </select>
//           </div>

//           <button type="submit" className={styles.ticketReportSubmitButton}>
//             <Check size={20} />
//             <span>Submit ticket report</span>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // {/* Ticket Report Modal */}
// // {showTicketReportModal && (
// //   <div className={styles.modalOverlay}>
// //     <div className={styles.ticketReportModalContent}>
// //       <button
// //         onClick={() => {
// //           setShowTicketReportModal(false);
// //           setTicketDateIssued('');
// //           setTicketTimeIssued('');
// //           setTicketViolationType('');
// //         }}
// //         className={styles.ticketReportCloseButton}
// //       >
// //         <X size={24} />
// //       </button>

// //       <h2 className={styles.ticketReportTitle}>Report a ticket:</h2>

// //       <form
// //         onSubmit={async (e) => {
// //           e.preventDefault();

// //           const ticketData = {
// //             latitude: reportLocation?.lat,
// //             longitude: reportLocation?.lng,
// //             ticket_report_date: ticketDateIssued,
// //             ticket_report_hour: ticketTimeIssued,
// //             username: username || 'Anonymous',
// //             violationType: ticketViolationType,
// //           };

// //           try {
// //             console.log('Submitting ticket data:', ticketData);

// //             const response = await fetch('/api/post-ticket', {
// //               method: 'POST',
// //               headers: {
// //                 'Content-Type': 'application/json',
// //               },
// //               body: JSON.stringify(ticketData),
// //             });

// //             console.log('Response status:', response.status);

// //             const result = await response.json();
// //             console.log('Response data:', result);

// //             if (response.ok) {
// //               console.log('Ticket submitted successfully:', result);
// //               // Refresh the heatmap data to show the new ticket
// //               refetchTickets();
// //               // Show success toast
// //               setSuccessMessage('Ticket reported successfully!');
// //               setShowSuccessToast(true);
// //               setTimeout(() => setShowSuccessToast(false), 3000);
// //             } else {
// //               console.error('Error submitting ticket:', result);
// //               setErrorMessage(result.error || 'Failed to submit ticket');
// //               setShowErrorToast(true);
// //               setTimeout(() => setShowErrorToast(false), 3000);
// //             }
// //           } catch (error) {
// //             console.error('Network error:', error);
// //             setErrorMessage('Network error: Failed to submit ticket');
// //             setShowErrorToast(true);
// //             setTimeout(() => setShowErrorToast(false), 3000);
// //           }

// //           setShowTicketReportModal(false);
// //           setTicketDateIssued('');
// //           setTicketTimeIssued('');
// //           setTicketViolationType('');
// //           setReportLocation(null);
// //         }}
// //         className={styles.ticketReportForm}
// //       >
// //         <div className={styles.ticketReportFormGroup}>
// //           <label className={styles.ticketReportLabel}>Date issued:</label>
// //           <input
// //             type="date"
// //             className={styles.ticketReportInput}
// //             value={ticketDateIssued}
// //             onChange={(e) => setTicketDateIssued(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <div className={styles.ticketReportFormGroup}>
// //           <label className={styles.ticketReportLabel}>Time issued:</label>
// //           <input
// //             type="time"
// //             className={styles.ticketReportInput}
// //             value={ticketTimeIssued}
// //             onChange={(e) => setTicketTimeIssued(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <div className={styles.ticketReportFormGroup}>
// //           <label className={styles.ticketReportLabel}>Violation type:</label>
// //           <input
// //             type="text"
// //             className={styles.ticketReportInput}
// //             value={ticketViolationType}
// //             onChange={(e) => setTicketViolationType(e.target.value)}
// //             required
// //           />
// //         </div>

// //         <div className={styles.ticketReportFormGroup}>
// //           <label className={styles.ticketReportLabel}>Ticket Violation Type:</label>
// //           <input
// //             type="text"
// //             className={styles.ticketReportInput}
// //             value={ticketViolationType}
// //             onChange={(e) => setTicketViolationType(e.target.value)}
// //             required
// //           />
// //           <select id="cars" name="cars">
// //             <option value="volvo">Volvo</option>
// //             <option value="saab">Saab</option>
// //             <option value="fiat">Fiat</option>
// //             <option value="audi">Audi</option>
// //           </select>
// //         </div>

// //         <button type="submit" className={styles.ticketReportSubmitButton}>
// //           <Check size={20} />
// //           <span>Submit ticket report</span>
// //         </button>
// //       </form>
// //     </div>
// //   </div>
// // )}
