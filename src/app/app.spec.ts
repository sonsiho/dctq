import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MemberDataService } from './member-data.service';

describe('App', () => {
  const memberDataStub = {
    loadMembers: () =>
      Promise.resolve({
        members: [],
        source: 'sample' as const,
        message: 'Test data',
      }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: MemberDataService, useValue: memberDataStub }],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the command dashboard shell', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('AEVN Command');
  });
});
