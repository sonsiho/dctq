import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, registerables, type ChartConfiguration } from 'chart.js';

import { MemberDataService } from './member-data.service';
import type { Faction, FactionKey, Member, NumericMemberKey } from './member.model';

Chart.register(...registerables);

type PageId = 'dashboard' | 'members' | 'profile' | 'matchmaking';
type SortDirection = 'asc' | 'desc';
type SortKey = keyof Member;

interface PageTab {
  id: PageId;
  label: string;
  kicker: string;
}

interface KpiCard {
  label: string;
  value: string;
  detail: string;
  tone: 'red' | 'gold' | 'purple' | 'cyan';
}

interface NumberField {
  key: NumericMemberKey;
  label: string;
  compactLabel: string;
}

interface FilteredMembersCache {
  members: Member[];
  searchTerm: string;
  scoreMin: number | null;
  scoreMax: number | null;
  atkMin: number | null;
  hpMin: number | null;
  dominantKey: NumericMemberKey | '';
  dominantThreshold: number;
  sortKey: SortKey;
  sortDirection: SortDirection;
  value: Member[];
}

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('distributionCanvas') private distributionCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('radarCanvas') private radarCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('profileCanvas') private profileCanvas?: ElementRef<HTMLCanvasElement>;

  readonly pages: PageTab[] = [
    { id: 'dashboard', label: 'Tổng quan', kicker: 'Dashboard' },
    { id: 'members', label: 'Thành viên', kicker: 'Directory' },
    { id: 'profile', label: 'Hồ sơ', kicker: 'Profile' },
    { id: 'matchmaking', label: 'Xếp đội hình', kicker: 'Event tool' },
  ];

  readonly factions: Faction[] = [
    {
      key: 'shu',
      label: 'Thục',
      shortLabel: 'Thục',
      resistKey: 'resistShu',
      slayKey: 'slayShu',
    },
    {
      key: 'wu',
      label: 'Ngô',
      shortLabel: 'Ngô',
      resistKey: 'resistWu',
      slayKey: 'slayWu',
    },
    {
      key: 'wei',
      label: 'Ngụy',
      shortLabel: 'Ngụy',
      resistKey: 'resistWei',
      slayKey: 'slayWei',
    },
    {
      key: 'qun',
      label: 'Quần',
      shortLabel: 'Quần',
      resistKey: 'resistQun',
      slayKey: 'slayQun',
    },
  ];

  readonly gemFields: NumberField[] = [
    { key: 'gemLimitGold', label: 'Lỗ vàng giới hạn', compactLabel: 'Vàng GH' },
    { key: 'gemLimitPurple', label: 'Lỗ tím giới hạn', compactLabel: 'Tím GH' },
    { key: 'gemNormalGold', label: 'Lỗ vàng thường', compactLabel: 'Vàng thường' },
    { key: 'gemNormalPurple', label: 'Lỗ tím thường', compactLabel: 'Tím thường' },
  ];

  readonly gearFields: NumberField[] = [
    { key: 'gearHp', label: 'Chỉ số máu quân bị', compactLabel: 'Máu' },
    { key: 'gearAtk', label: 'Chỉ số công quân bị', compactLabel: 'Công' },
  ];

  readonly resistFields: NumberField[] = [
    { key: 'resistShu', label: 'Kháng Thục', compactLabel: 'K. Thục' },
    { key: 'resistWu', label: 'Kháng Ngô', compactLabel: 'K. Ngô' },
    { key: 'resistWei', label: 'Kháng Ngụy', compactLabel: 'K. Ngụy' },
    { key: 'resistQun', label: 'Kháng Quần', compactLabel: 'K. Quần' },
  ];

  readonly slayFields: NumberField[] = [
    { key: 'slayShu', label: 'Diệt Thục', compactLabel: 'D. Thục' },
    { key: 'slayWu', label: 'Diệt Ngô', compactLabel: 'D. Ngô' },
    { key: 'slayWei', label: 'Diệt Ngụy', compactLabel: 'D. Ngụy' },
    { key: 'slayQun', label: 'Diệt Quần', compactLabel: 'D. Quần' },
  ];

  readonly tableColumns: Array<{ key: SortKey; label: string; align?: 'right' }> = [
    { key: 'registeredAt', label: 'Dấu thời gian' },
    { key: 'gameName', label: 'Tên game' },
    { key: 'zaloName', label: 'Zalo' },
    { key: 'gameId', label: 'ID game' },
    { key: 'powerScore', label: 'Cột 1', align: 'right' },
    { key: 'gemLimitGold', label: 'Vàng GH', align: 'right' },
    { key: 'gemLimitPurple', label: 'Tím GH', align: 'right' },
    { key: 'gemNormalGold', label: 'Vàng thường', align: 'right' },
    { key: 'gemNormalPurple', label: 'Tím thường', align: 'right' },
    { key: 'gearAtk', label: 'Công', align: 'right' },
    { key: 'gearHp', label: 'Máu', align: 'right' },
    { key: 'slayShu', label: 'D. Thục', align: 'right' },
    { key: 'slayWu', label: 'D. Ngô', align: 'right' },
    { key: 'slayWei', label: 'D. Ngụy', align: 'right' },
    { key: 'slayQun', label: 'D. Quần', align: 'right' },
    { key: 'resistShu', label: 'K. Thục', align: 'right' },
    { key: 'resistWu', label: 'K. Ngô', align: 'right' },
    { key: 'resistWei', label: 'K. Ngụy', align: 'right' },
    { key: 'resistQun', label: 'K. Quần', align: 'right' },
  ];

  members: Member[] = [];
  activePage: PageId = 'dashboard';
  isLoading = true;
  dataMessage = 'Đang tải dữ liệu...';
  dataSource: 'firestore' | 'local' | 'sample' = 'sample';
  actionMessage = '';

  searchTerm = '';
  scoreMin: number | null = null;
  scoreMax: number | null = null;
  atkMin: number | null = null;
  hpMin: number | null = null;
  dominantKey: NumericMemberKey | '' = '';
  dominantThreshold = 70;

  sortKey: SortKey = 'powerScore';
  sortDirection: SortDirection = 'desc';
  currentPage = 1;
  pageSize = 8;

  selectedMemberId = '';
  targetFaction: FactionKey = 'shu';
  lineupSize = 5;

  formOpen = false;
  formMode: 'create' | 'edit' = 'create';
  formModel: Member = this.blankMember();
  isSaving = false;
  formError = '';

  private distributionChart?: Chart;
  private radarChart?: Chart;
  private profileChart?: Chart;
  private filteredMembersCache?: FilteredMembersCache;
  private chartRefreshTimer: number | undefined;
  private loadSequence = 0;
  private isDestroyed = false;

  constructor(
    private readonly memberData: MemberDataService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadMembers();
  }

  ngAfterViewInit(): void {
    this.queueChartRefresh();
  }

  ngOnDestroy(): void {
    this.isDestroyed = true;
    if (this.chartRefreshTimer !== undefined) {
      window.clearTimeout(this.chartRefreshTimer);
    }

    this.distributionChart?.destroy();
    this.radarChart?.destroy();
    this.profileChart?.destroy();
  }

  async loadMembers(): Promise<void> {
    const loadId = ++this.loadSequence;
    this.isLoading = true;
    this.markViewForCheck();

    let shouldRefreshCharts = false;

    try {
      const result = await this.memberData.loadMembers();
      if (!this.isActiveLoad(loadId)) {
        return;
      }

      this.members = result.members;
      this.dataSource = result.source;
      this.dataMessage = result.message;

      if (
        this.selectedMemberId &&
        !this.members.some((member) => member.id === this.selectedMemberId)
      ) {
        this.selectedMemberId = '';
      }

      if (!this.selectedMemberId && this.members.length > 0) {
        this.selectedMemberId = this.topMembers(1)[0]?.id ?? this.members[0].id;
      }

      this.currentPage = Math.min(this.currentPage, this.totalPages());
      shouldRefreshCharts = true;
    } catch (error) {
      if (!this.isActiveLoad(loadId)) {
        return;
      }

      const message = error instanceof Error && error.message ? ` ${error.message}` : '';
      this.dataMessage = `Không tải được dữ liệu.${message}`;
      this.actionMessage = 'Không tải được dữ liệu, vui lòng thử lại.';
    } finally {
      if (this.isActiveLoad(loadId)) {
        this.isLoading = false;
        this.markViewForCheck();

        if (shouldRefreshCharts) {
          this.queueChartRefresh();
        }
      }
    }
  }

  switchPage(page: PageId): void {
    this.activePage = page;

    if (page === 'profile' && !this.selectedMember()) {
      this.selectedMemberId = this.topMembers(1)[0]?.id ?? '';
    }

    this.queueChartRefresh();
  }

  pageTitle(): string {
    return this.pages.find((page) => page.id === this.activePage)?.label ?? 'Dashboard';
  }

  sourceLabel(): string {
    const labels = {
      firestore: 'Firestore',
      local: 'Local',
      sample: 'Mẫu',
    };
    return labels[this.dataSource];
  }

  kpiCards(): KpiCard[] {
    const top = this.topMembers(1)[0];

    return [
      {
        label: 'Thành viên đăng ký',
        value: this.formatNumber(this.members.length),
        detail: `${this.filteredMembers().length} đang khớp bộ lọc`,
        tone: 'red',
      },
      {
        label: 'TB Cột 1',
        value: this.formatNumber(this.average('powerScore')),
        detail: 'Điểm tổng hợp quy đổi',
        tone: 'gold',
      },
      {
        label: 'Top lực chiến',
        value: top ? this.formatNumber(top.powerScore) : '0',
        detail: top ? top.gameName : 'Chưa có dữ liệu',
        tone: 'purple',
      },
      {
        label: 'Tổng công/máu',
        value: `${this.formatNumber(this.sum('gearAtk'))}/${this.formatNumber(this.sum('gearHp'))}`,
        detail: 'Quân bị toàn quân đoàn',
        tone: 'cyan',
      },
    ];
  }

  distributionBuckets(): Array<{ label: string; count: number }> {
    const buckets = [
      { label: '<300', count: 0 },
      { label: '300-399', count: 0 },
      { label: '400-499', count: 0 },
      { label: '>=500', count: 0 },
    ];

    for (const member of this.members) {
      if (member.powerScore < 300) {
        buckets[0].count += 1;
      } else if (member.powerScore < 400) {
        buckets[1].count += 1;
      } else if (member.powerScore < 500) {
        buckets[2].count += 1;
      } else {
        buckets[3].count += 1;
      }
    }

    return buckets;
  }

  filteredMembers(): Member[] {
    const term = this.searchTerm.trim().toLowerCase();
    const scoreMin = this.optionalNumber(this.scoreMin);
    const scoreMax = this.optionalNumber(this.scoreMax);
    const atkMin = this.optionalNumber(this.atkMin);
    const hpMin = this.optionalNumber(this.hpMin);
    const dominantThreshold = this.optionalNumber(this.dominantThreshold) ?? 0;
    const cache = this.filteredMembersCache;

    if (
      cache &&
      cache.members === this.members &&
      cache.searchTerm === term &&
      cache.scoreMin === scoreMin &&
      cache.scoreMax === scoreMax &&
      cache.atkMin === atkMin &&
      cache.hpMin === hpMin &&
      cache.dominantKey === this.dominantKey &&
      cache.dominantThreshold === dominantThreshold &&
      cache.sortKey === this.sortKey &&
      cache.sortDirection === this.sortDirection
    ) {
      return cache.value;
    }

    const value = [...this.members]
      .filter((member) => {
        const searchText = `${member.gameId} ${member.zaloName} ${member.gameName}`.toLowerCase();
        const matchesSearch = !term || searchText.includes(term);
        const matchesScoreMin = scoreMin === null || member.powerScore >= scoreMin;
        const matchesScoreMax = scoreMax === null || member.powerScore <= scoreMax;
        const matchesAtk = atkMin === null || member.gearAtk >= atkMin;
        const matchesHp = hpMin === null || member.gearHp >= hpMin;
        const matchesDominant = !this.dominantKey || member[this.dominantKey] >= dominantThreshold;

        return (
          matchesSearch &&
          matchesScoreMin &&
          matchesScoreMax &&
          matchesAtk &&
          matchesHp &&
          matchesDominant
        );
      })
      .sort((a, b) => this.compareMembers(a, b));

    this.filteredMembersCache = {
      members: this.members,
      searchTerm: term,
      scoreMin,
      scoreMax,
      atkMin,
      hpMin,
      dominantKey: this.dominantKey,
      dominantThreshold,
      sortKey: this.sortKey,
      sortDirection: this.sortDirection,
      value,
    };

    return value;
  }

  paginatedMembers(): Member[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredMembers().slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredMembers().length / this.pageSize));
  }

  setSort(key: SortKey): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection =
        key === 'gameName' || key === 'zaloName' || key === 'gameId' ? 'asc' : 'desc';
    }
  }

  sortIndicator(key: SortKey): string {
    if (this.sortKey !== key) {
      return '';
    }

    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  cellValue(member: Member, key: SortKey): string {
    const value = member[key];

    if (key === 'registeredAt') {
      return this.formatDate(String(value));
    }

    return typeof value === 'number' ? this.formatNumber(value) : String(value);
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(1, page), this.totalPages());
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.scoreMin = null;
    this.scoreMax = null;
    this.atkMin = null;
    this.hpMin = null;
    this.dominantKey = '';
    this.dominantThreshold = 70;
    this.currentPage = 1;
  }

  suggestions(): string[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.topMembers(6).map((member) => `${member.gameId} - ${member.zaloName}`);
    }

    const values = new Set<string>();
    for (const member of this.members) {
      for (const value of [member.gameId, member.zaloName, member.gameName]) {
        if (value.toLowerCase().includes(term)) {
          values.add(value);
        }
      }
    }

    return [...values].slice(0, 8);
  }

  openCreate(): void {
    this.formMode = 'create';
    this.formModel = this.blankMember();
    this.formError = '';
    this.formOpen = true;
  }

  openEdit(member: Member): void {
    this.formMode = 'edit';
    this.formModel = { ...member };
    this.formError = '';
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
    this.formError = '';
  }

  async saveForm(): Promise<void> {
    if (
      !this.formModel.zaloName.trim() ||
      !this.formModel.gameName.trim() ||
      !this.formModel.gameId.trim()
    ) {
      this.formError = 'Vui lòng nhập Tên Zalo, Tên trong Game và ID game.';
      this.markViewForCheck();
      return;
    }

    this.isSaving = true;
    this.formError = '';
    this.markViewForCheck();

    try {
      const result = await this.memberData.saveMember({ ...this.formModel });
      this.upsertMemberInMemory(result.member);
      this.actionMessage = result.message;
      this.dataSource = result.source;
      this.formOpen = false;
      this.selectedMemberId = result.member.id;
      this.queueChartRefresh();
    } catch (error) {
      const message = error instanceof Error && error.message ? ` ${error.message}` : '';
      this.formError = `Không lưu được dữ liệu.${message}`;
    } finally {
      this.isSaving = false;
      this.markViewForCheck();
    }
  }

  viewProfile(member: Member): void {
    this.selectedMemberId = member.id;
    this.switchPage('profile');
  }

  selectedMember(): Member | null {
    return (
      this.members.find((member) => member.id === this.selectedMemberId) ??
      this.topMembers(1)[0] ??
      null
    );
  }

  topMembers(limit = 5): Member[] {
    return [...this.members].sort((a, b) => b.powerScore - a.powerScore).slice(0, limit);
  }

  topValueFor(field: NumericMemberKey): number {
    return Math.max(1, ...this.members.map((member) => member[field]));
  }

  memberFactionScore(member: Member, faction: Faction = this.activeFaction()): number {
    return Math.round(
      member[faction.slayKey] * 0.45 + member[faction.resistKey] * 0.35 + member.powerScore * 0.2,
    );
  }

  recommendedLineup(): Member[] {
    const faction = this.activeFaction();
    return [...this.members]
      .sort((a, b) => this.memberFactionScore(b, faction) - this.memberFactionScore(a, faction))
      .slice(0, Math.max(1, this.lineupSize));
  }

  activeFaction(): Faction {
    return this.factions.find((faction) => faction.key === this.targetFaction) ?? this.factions[0];
  }

  lineupText(): string {
    const faction = this.activeFaction();
    const rows = this.recommendedLineup().map((member, index) => {
      const rank = `${index + 1}.`.padEnd(3, ' ');
      return `${rank} ${member.gameName} (${member.gameId}) - Diệt ${faction.label}: ${
        member[faction.slayKey]
      }, Kháng ${faction.label}: ${member[faction.resistKey]}, Cột 1: ${member.powerScore}`;
    });

    return [`Đội hình AEVN đánh hệ ${faction.label}`, ...rows].join('\n');
  }

  async copyLineup(): Promise<void> {
    const text = this.lineupText();

    try {
      await navigator.clipboard.writeText(text);
      this.actionMessage = 'Đã copy đội hình vào clipboard.';
    } catch {
      this.downloadFile('aevn-lineup.txt', text, 'text/plain;charset=utf-8');
      this.actionMessage = 'Clipboard chưa sẵn sàng, đã xuất file text.';
    } finally {
      this.markViewForCheck();
    }
  }

  exportLineup(): void {
    this.downloadFile('aevn-lineup.txt', this.lineupText(), 'text/plain;charset=utf-8');
    this.actionMessage = 'Đã xuất file đội hình.';
  }

  exportExcel(): void {
    const headers = [
      'Dấu thời gian',
      'Tên Zalo',
      'Tên trong Game',
      'ID game',
      'Lỗ vàng giới hạn',
      'Lỗ tím giới hạn',
      'Lỗ vàng thường',
      'Lỗ tím thường',
      'Máu quân bị',
      'Công quân bị',
      'Kháng Thục',
      'Kháng Ngô',
      'Kháng Ngụy',
      'Kháng Quần',
      'Diệt Thục',
      'Diệt Ngô',
      'Diệt Ngụy',
      'Diệt Quần',
      'Cột 1',
    ];
    const rows = this.filteredMembers().map((member) => [
      this.formatDate(member.registeredAt),
      member.zaloName,
      member.gameName,
      member.gameId,
      member.gemLimitGold,
      member.gemLimitPurple,
      member.gemNormalGold,
      member.gemNormalPurple,
      member.gearHp,
      member.gearAtk,
      member.resistShu,
      member.resistWu,
      member.resistWei,
      member.resistQun,
      member.slayShu,
      member.slayWu,
      member.slayWei,
      member.slayQun,
      member.powerScore,
    ]);
    const html = [
      '<table>',
      `<thead><tr>${headers.map((header) => `<th>${this.escapeHtml(header)}</th>`).join('')}</tr></thead>`,
      `<tbody>${rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${this.escapeHtml(String(cell))}</td>`).join('')}</tr>`,
        )
        .join('')}</tbody>`,
      '</table>',
    ].join('');

    this.downloadFile(
      'aevn-members.xls',
      `\uFEFF${html}`,
      'application/vnd.ms-excel;charset=utf-8',
    );
    this.actionMessage = 'Đã xuất danh sách thành viên dạng Excel.';
  }

  formatNumber(value: number): string {
    return Math.round(value).toLocaleString('vi-VN');
  }

  formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString('vi-VN');
  }

  percent(value: number, max = 100): string {
    return `${Math.min(100, Math.round((value / Math.max(1, max)) * 100))}%`;
  }

  private blankMember(): Member {
    return {
      id: '',
      registeredAt: new Date().toISOString().slice(0, 10),
      zaloName: '',
      gameName: '',
      gameId: '',
      gemLimitGold: 0,
      gemLimitPurple: 0,
      gemNormalGold: 0,
      gemNormalPurple: 0,
      gearHp: 0,
      gearAtk: 0,
      resistShu: 0,
      resistWu: 0,
      resistWei: 0,
      resistQun: 0,
      slayShu: 0,
      slayWu: 0,
      slayWei: 0,
      slayQun: 0,
      powerScore: 0,
    };
  }

  private upsertMemberInMemory(member: Member): void {
    const index = this.members.findIndex((item) => item.id === member.id);
    if (index >= 0) {
      this.members = this.members.map((item) => (item.id === member.id ? member : item));
      return;
    }

    this.members = [member, ...this.members];
  }

  private compareMembers(a: Member, b: Member): number {
    const aValue = a[this.sortKey];
    const bValue = b[this.sortKey];
    const direction = this.sortDirection === 'asc' ? 1 : -1;

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return (aValue - bValue) * direction;
    }

    return String(aValue).localeCompare(String(bValue), 'vi') * direction;
  }

  private average(key: NumericMemberKey): number {
    if (this.members.length === 0) {
      return 0;
    }

    return this.sum(key) / this.members.length;
  }

  private sum(key: NumericMemberKey): number {
    return this.members.reduce((total, member) => total + member[key], 0);
  }

  private optionalNumber(value: number | string | null): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  }

  private queueChartRefresh(): void {
    if (this.isDestroyed) {
      return;
    }

    if (this.chartRefreshTimer !== undefined) {
      window.clearTimeout(this.chartRefreshTimer);
    }

    this.chartRefreshTimer = window.setTimeout(() => {
      this.chartRefreshTimer = undefined;

      if (!this.isDestroyed) {
        this.refreshCharts();
      }
    }, 0);
  }

  private refreshCharts(): void {
    if (this.activePage === 'dashboard') {
      this.renderDistributionChart();
      this.renderRadarChart();
    }

    if (this.activePage === 'profile') {
      this.renderProfileChart();
    }
  }

  private renderDistributionChart(): void {
    const canvas = this.distributionCanvas?.nativeElement;
    if (!canvas || !this.canRender(canvas)) {
      return;
    }

    this.distributionChart?.destroy();
    const buckets = this.distributionBuckets();
    this.distributionChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: buckets.map((bucket) => bucket.label),
        datasets: [
          {
            label: 'Thành viên',
            data: buckets.map((bucket) => bucket.count),
            backgroundColor: ['#ef5b4c', '#f1b64f', '#9d6bff', '#4fb9c8'],
            borderRadius: 6,
          },
        ],
      },
      options: this.chartOptions(false),
    });
  }

  private renderRadarChart(): void {
    const canvas = this.radarCanvas?.nativeElement;
    if (!canvas || !this.canRender(canvas)) {
      return;
    }

    this.radarChart?.destroy();
    const labels = [
      'K. Thục',
      'K. Ngô',
      'K. Ngụy',
      'K. Quần',
      'D. Thục',
      'D. Ngô',
      'D. Ngụy',
      'D. Quần',
    ];
    const data = [
      this.average('resistShu'),
      this.average('resistWu'),
      this.average('resistWei'),
      this.average('resistQun'),
      this.average('slayShu'),
      this.average('slayWu'),
      this.average('slayWei'),
      this.average('slayQun'),
    ];

    this.radarChart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels,
        datasets: [
          {
            label: 'Trung bình quân đoàn',
            data,
            backgroundColor: 'rgba(157, 107, 255, 0.22)',
            borderColor: '#b58bff',
            pointBackgroundColor: '#f1b64f',
            pointBorderColor: '#15161b',
          },
        ],
      },
      options: {
        ...this.chartOptions(true),
        scales: {
          r: {
            min: 0,
            max: 100,
            grid: { color: 'rgba(255,255,255,0.12)' },
            angleLines: { color: 'rgba(255,255,255,0.12)' },
            pointLabels: { color: '#d8dbe6', font: { size: 12 } },
            ticks: { color: '#9da4b8', backdropColor: 'transparent' },
          },
        },
      },
    });
  }

  private renderProfileChart(): void {
    const canvas = this.profileCanvas?.nativeElement;
    const member = this.selectedMember();
    if (!canvas || !member || !this.canRender(canvas)) {
      return;
    }

    this.profileChart?.destroy();
    this.profileChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: this.factions.map((faction) => faction.shortLabel),
        datasets: [
          {
            label: 'Kháng',
            data: this.factions.map((faction) => member[faction.resistKey]),
            backgroundColor: '#4fb9c8',
            borderRadius: 6,
          },
          {
            label: 'Diệt',
            data: this.factions.map((faction) => member[faction.slayKey]),
            backgroundColor: '#ef5b4c',
            borderRadius: 6,
          },
        ],
      },
      options: this.chartOptions(true),
    });
  }

  private chartOptions(showLegend: boolean): ChartConfiguration['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: showLegend,
          labels: { color: '#d8dbe6', boxWidth: 12, boxHeight: 12 },
        },
        tooltip: {
          backgroundColor: '#17191f',
          titleColor: '#ffffff',
          bodyColor: '#d8dbe6',
          borderColor: 'rgba(255,255,255,0.14)',
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: '#aeb5c7' },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          ticks: { color: '#aeb5c7', precision: 0 },
          grid: { color: 'rgba(255,255,255,0.08)' },
        },
      },
    };
  }

  private canRender(canvas: HTMLCanvasElement): boolean {
    try {
      return Boolean(canvas.getContext('2d'));
    } catch {
      return false;
    }
  }

  private isActiveLoad(loadId: number): boolean {
    return !this.isDestroyed && loadId === this.loadSequence;
  }

  private markViewForCheck(): void {
    if (!this.isDestroyed) {
      this.cdr.markForCheck();
    }
  }

  private downloadFile(filename: string, content: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private escapeHtml(value: string): string {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }
}
