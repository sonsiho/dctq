import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MemberDataService } from './member-data.service';
import type { DataLoadResult } from './member.model';

describe('App', () => {
  let memberDataStub: { loadMembers: () => Promise<DataLoadResult> };

  const emptyResult = (): DataLoadResult => ({
    members: [],
    source: 'sample',
    message: 'Test data',
  });

  beforeEach(async () => {
    memberDataStub = {
      loadMembers: () => Promise.resolve(emptyResult()),
    };

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

  it('should clear the loader when member data resolves', async () => {
    let resolveLoad: ((result: DataLoadResult) => void) | undefined;
    memberDataStub.loadMembers = () =>
      new Promise<DataLoadResult>((resolve) => {
        resolveLoad = resolve;
      });

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    let compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loader')).not.toBeNull();
    expect(resolveLoad).toBeDefined();

    resolveLoad?.(emptyResult());
    await fixture.whenStable();
    fixture.detectChanges();

    compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loader')).toBeNull();
    expect(compiled.textContent).toContain('Test data');
  });

  it('should clear loading if member data fails', async () => {
    memberDataStub.loadMembers = () => Promise.reject(new Error('backend failed'));

    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    expect(app.isLoading).toBe(false);
    expect(compiled.querySelector('.loader')).toBeNull();
    expect(app.actionMessage).not.toBe('');
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
