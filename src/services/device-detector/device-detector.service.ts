import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeviceDetectorService {
  isMobile(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
  }

  isAndroid(): boolean {
    return /android/i.test(navigator.userAgent);
  }

  isIOS(): boolean {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }

  isTablet(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(userAgent);
  }

  isDesktop(): boolean {
    return !this.isMobile();
  }
}
