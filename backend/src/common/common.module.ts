import { Module, Global } from '@nestjs/common';
import { QRCodeService } from './services/qrcode.service';
import { PDFService } from './services/pdf.service';
import { MapsService } from './services/maps.service';
import { FileUploadService } from './services/file-upload.service';

@Global()
@Module({
  providers: [QRCodeService, PDFService, MapsService, FileUploadService],
  exports: [QRCodeService, PDFService, MapsService, FileUploadService],
})
export class CommonModule {}
