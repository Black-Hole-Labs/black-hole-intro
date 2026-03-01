import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypingAnimationService } from '../services/typing-animation.service';
import { TitleAnimationService } from '../services/title-animation.service';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent
  ],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss',
		'./terms.component.adaptives.scss'
	],
})
export class TermsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('description') descriptionEl!: ElementRef<HTMLElement>;
	@ViewChild('description2') description2El!: ElementRef<HTMLElement>;
	@ViewChild('description3') description3El!: ElementRef<HTMLElement>;

  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private performanceObserver?: IntersectionObserver;
  private menuItems: { element: HTMLElement; originalText: string }[] = [];
  private activeAnimations: Set<HTMLElement> = new Set();

  constructor(
    private renderer: Renderer2,
    private typingAnimation: TypingAnimationService,
    private titleAnimationService: TitleAnimationService
  ) {}

  ngAfterViewInit(): void {
    this.typingAnimation.initialize(
      undefined,
      [this.descriptionEl, this.description2El, this.description3El],
      this.renderer
    );
    
    this.initializePerformanceCounter();
    
    this.initializeMenuAnimation();
  }

  private initializePerformanceCounter(): void {
    const performanceSection = document.querySelector('.perfomance');
    if (!performanceSection) return;

    this.performanceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(1) h1', 24, 0);
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(2) h1', 700, 0, '<', 'ms');
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(3) h1', 8, 0);
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(4) h1', 99.98, 0, '', '%', true);
            
            
            this.performanceObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    this.performanceObserver.observe(performanceSection);
  }

  private animateCounter(
    selector: string, 
    target: number, 
    start: number = 0, 
    prefix: string = '', 
    suffix: string = '',
    isDecimal: boolean = false
  ): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    const duration = 2000; 
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const current = start + (target - start) * easeProgress;
      
      if (isDecimal) {
        element.textContent = prefix + current.toFixed(2) + suffix;
      } else {
        element.textContent = prefix + Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private initializeMenuAnimation(): void {
    
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach((link) => {
      const element = link as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const tagElements = document.querySelectorAll('.tag');
    
    tagElements.forEach((tag) => {
      const element = tag as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const postElements = document.querySelectorAll('.post p');
    
    postElements.forEach((postElement) => {
      const element = postElement as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const bottomLinkElements = document.querySelectorAll('.bottom-link');
    
    bottomLinkElements.forEach((bottomLink) => {
      const element = bottomLink as HTMLElement;
      const originalText = element.textContent || '';
      
      
      this.menuItems.push({ element, originalText });
      
      
      element.addEventListener('mouseenter', () => {
        
        this.titleAnimationService.clearAnimationForElement(element);
        
        
        element.textContent = originalText;
        
        
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      
      element.addEventListener('mouseleave', () => {
        
        
      });
    });

    
    const buttonElements = document.querySelectorAll('.button');
    
    buttonElements.forEach((button) => {
      const buttonElement = button as HTMLElement;
      const textElement = buttonElement.querySelector('p') as HTMLElement;
      
      if (textElement) {
        const originalText = textElement.textContent || '';
        
        
        this.menuItems.push({ element: textElement, originalText });
        
        
        buttonElement.addEventListener('mouseenter', () => {
          
          this.titleAnimationService.clearAnimationForElement(textElement);
          
          
          textElement.textContent = originalText;
          
          
          this.activeAnimations.add(textElement);
          this.titleAnimationService.startTitleAnimation(
            textElement,
            originalText,
            {
              animationFrames: 30,
              animationSpeed: 25,
              glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
              cyberChars: '01',
              possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
            }
          );
        });
        
        
        buttonElement.addEventListener('mouseleave', () => {
          
          
        });
      }
    });
  }

  private stopAllAnimations(): void {
    
    this.titleAnimationService.clearAnimation();
    
    
    this.menuItems.forEach(({ element, originalText }) => {
      element.textContent = originalText;
    });
    
    
    this.activeAnimations.clear();
  }

  ngOnDestroy(): void {
    this.typingAnimation.destroy();
    this.stopAllAnimations();
    
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }
    
    
    document.body.style.overflow = '';
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
    if (pageContainer) {
      pageContainer.style.overflow = '';
      pageContainer.style.height = '';
    }
  }
} 
