import { Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { QRCodeService } from './qrcode.service';

@Injectable()
export class PDFService {
  constructor(private readonly qrCodeService: QRCodeService) {}

  /**
   * Generate booking ticket PDF
   */
  async generateTicketPDF(booking: any): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
        });

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });

        // Header
        doc
          .fontSize(25)
          .fillColor('#2563eb')
          .text('JOKA Platform', { align: 'center' })
          .moveDown(0.5);

        doc
          .fontSize(20)
          .fillColor('#000000')
          .text('Ticket de Réservation', { align: 'center' })
          .moveDown(1);

        // Booking details
        doc
          .fontSize(12)
          .fillColor('#374151')
          .text(`Numéro de réservation: ${booking.id}`, { align: 'left' })
          .moveDown(0.5)
          .text(`Service: ${booking.service.name}`)
          .moveDown(0.5)
          .text(`Client: ${booking.user.firstName} ${booking.user.lastName}`)
          .moveDown(0.5)
          .text(`Email: ${booking.user.email}`)
          .moveDown(0.5)
          .text(`Téléphone: ${booking.user.phone || 'N/A'}`)
          .moveDown(0.5)
          .text(`Date: ${new Date(booking.bookingDate).toLocaleDateString('fr-FR')}`)
          .moveDown(0.5)
          .text(`Heure: ${booking.bookingTime || 'N/A'}`)
          .moveDown(0.5)
          .text(`Prix: ${booking.totalPrice} ${booking.currency}`)
          .moveDown(0.5)
          .text(`Statut: ${booking.status}`)
          .moveDown(2);

        // QR Code
        const qrCodeData = `JOKA-${booking.id}`;
        const qrCodeBuffer = await this.qrCodeService.generateQRCodeBuffer(qrCodeData);

        doc.image(qrCodeBuffer, {
          fit: [200, 200],
          align: 'center',
          valign: 'center',
        });

        doc.moveDown(2);

        // Footer
        doc
          .fontSize(10)
          .fillColor('#6b7280')
          .text('Présentez ce ticket à l\'établissement pour valider votre réservation.', {
            align: 'center',
          })
          .moveDown(0.5)
          .text('Merci d\'avoir choisi JOKA!', { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
