import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';

import { ensureAuthenticatedUser, firestore } from './firebase';
import type { DataLoadResult, Member, SaveMemberResult } from './member.model';

const LOCAL_STORAGE_KEY = 'aevn-event-members-v1';
const MEMBERS_COLLECTION = 'members';

export const SAMPLE_MEMBERS: Member[] = [
  {
    id: 'sample-aevn-001',
    registeredAt: '2026-07-01',
    zaloName: 'An Nguyen',
    gameName: 'AEVN.HoangLong',
    gameId: 'AEVN001',
    gemLimitGold: 18,
    gemLimitPurple: 16,
    gemNormalGold: 22,
    gemNormalPurple: 20,
    gearHp: 88,
    gearAtk: 96,
    resistShu: 74,
    resistWu: 63,
    resistWei: 69,
    resistQun: 58,
    slayShu: 82,
    slayWu: 71,
    slayWei: 76,
    slayQun: 68,
    powerScore: 548,
  },
  {
    id: 'sample-aevn-002',
    registeredAt: '2026-07-01',
    zaloName: 'Bao Tran',
    gameName: 'BachHo',
    gameId: 'AEVN014',
    gemLimitGold: 15,
    gemLimitPurple: 18,
    gemNormalGold: 18,
    gemNormalPurple: 21,
    gearHp: 91,
    gearAtk: 84,
    resistShu: 66,
    resistWu: 78,
    resistWei: 62,
    resistQun: 73,
    slayShu: 70,
    slayWu: 86,
    slayWei: 65,
    slayQun: 80,
    powerScore: 521,
  },
  {
    id: 'sample-aevn-003',
    registeredAt: '2026-07-02',
    zaloName: 'Chi Le',
    gameName: 'TuongQuan',
    gameId: 'AEVN022',
    gemLimitGold: 12,
    gemLimitPurple: 14,
    gemNormalGold: 26,
    gemNormalPurple: 18,
    gearHp: 79,
    gearAtk: 88,
    resistShu: 57,
    resistWu: 61,
    resistWei: 80,
    resistQun: 66,
    slayShu: 64,
    slayWu: 69,
    slayWei: 91,
    slayQun: 73,
    powerScore: 493,
  },
  {
    id: 'sample-aevn-004',
    registeredAt: '2026-07-02',
    zaloName: 'Duc Pham',
    gameName: 'ThienKiem',
    gameId: 'AEVN031',
    gemLimitGold: 11,
    gemLimitPurple: 9,
    gemNormalGold: 20,
    gemNormalPurple: 15,
    gearHp: 72,
    gearAtk: 81,
    resistShu: 62,
    resistWu: 53,
    resistWei: 67,
    resistQun: 77,
    slayShu: 71,
    slayWu: 58,
    slayWei: 75,
    slayQun: 89,
    powerScore: 456,
  },
  {
    id: 'sample-aevn-005',
    registeredAt: '2026-07-03',
    zaloName: 'Ha Vu',
    gameName: 'HoaPhung',
    gameId: 'AEVN045',
    gemLimitGold: 8,
    gemLimitPurple: 12,
    gemNormalGold: 17,
    gemNormalPurple: 19,
    gearHp: 68,
    gearAtk: 74,
    resistShu: 49,
    resistWu: 70,
    resistWei: 59,
    resistQun: 52,
    slayShu: 56,
    slayWu: 77,
    slayWei: 61,
    slayQun: 55,
    powerScore: 397,
  },
  {
    id: 'sample-aevn-006',
    registeredAt: '2026-07-03',
    zaloName: 'Khanh Do',
    gameName: 'LoiVu',
    gameId: 'AEVN052',
    gemLimitGold: 10,
    gemLimitPurple: 11,
    gemNormalGold: 15,
    gemNormalPurple: 16,
    gearHp: 64,
    gearAtk: 69,
    resistShu: 55,
    resistWu: 48,
    resistWei: 51,
    resistQun: 60,
    slayShu: 63,
    slayWu: 54,
    slayWei: 57,
    slayQun: 66,
    powerScore: 368,
  },
  {
    id: 'sample-aevn-007',
    registeredAt: '2026-07-04',
    zaloName: 'Linh Mai',
    gameName: 'NhatNguyet',
    gameId: 'AEVN063',
    gemLimitGold: 6,
    gemLimitPurple: 7,
    gemNormalGold: 12,
    gemNormalPurple: 14,
    gearHp: 58,
    gearAtk: 62,
    resistShu: 43,
    resistWu: 46,
    resistWei: 50,
    resistQun: 44,
    slayShu: 51,
    slayWu: 49,
    slayWei: 55,
    slayQun: 48,
    powerScore: 324,
  },
  {
    id: 'sample-aevn-008',
    registeredAt: '2026-07-04',
    zaloName: 'Minh Cao',
    gameName: 'XichDiem',
    gameId: 'AEVN074',
    gemLimitGold: 4,
    gemLimitPurple: 6,
    gemNormalGold: 10,
    gemNormalPurple: 9,
    gearHp: 47,
    gearAtk: 53,
    resistShu: 38,
    resistWu: 41,
    resistWei: 35,
    resistQun: 44,
    slayShu: 46,
    slayWu: 42,
    slayWei: 39,
    slayQun: 50,
    powerScore: 287,
  },
  {
    id: 'sample-aevn-009',
    registeredAt: '2026-07-05',
    zaloName: 'Nhi Ho',
    gameName: 'ThanhLong',
    gameId: 'AEVN081',
    gemLimitGold: 13,
    gemLimitPurple: 15,
    gemNormalGold: 21,
    gemNormalPurple: 23,
    gearHp: 82,
    gearAtk: 90,
    resistShu: 71,
    resistWu: 65,
    resistWei: 72,
    resistQun: 61,
    slayShu: 79,
    slayWu: 73,
    slayWei: 84,
    slayQun: 69,
    powerScore: 505,
  },
  {
    id: 'sample-aevn-010',
    registeredAt: '2026-07-05',
    zaloName: 'Phong Bui',
    gameName: 'HacAnh',
    gameId: 'AEVN093',
    gemLimitGold: 9,
    gemLimitPurple: 10,
    gemNormalGold: 13,
    gemNormalPurple: 16,
    gearHp: 74,
    gearAtk: 72,
    resistShu: 60,
    resistWu: 58,
    resistWei: 64,
    resistQun: 56,
    slayShu: 68,
    slayWu: 63,
    slayWei: 70,
    slayQun: 61,
    powerScore: 418,
  },
  {
    id: 'sample-aevn-011',
    registeredAt: '2026-07-06',
    zaloName: 'Quang Lam',
    gameName: 'KimGiap',
    gameId: 'AEVN108',
    gemLimitGold: 16,
    gemLimitPurple: 13,
    gemNormalGold: 19,
    gemNormalPurple: 18,
    gearHp: 97,
    gearAtk: 78,
    resistShu: 85,
    resistWu: 76,
    resistWei: 81,
    resistQun: 74,
    slayShu: 66,
    slayWu: 62,
    slayWei: 69,
    slayQun: 65,
    powerScore: 476,
  },
  {
    id: 'sample-aevn-012',
    registeredAt: '2026-07-06',
    zaloName: 'Vy Dang',
    gameName: 'TuAnh',
    gameId: 'AEVN119',
    gemLimitGold: 14,
    gemLimitPurple: 19,
    gemNormalGold: 16,
    gemNormalPurple: 24,
    gearHp: 70,
    gearAtk: 99,
    resistShu: 59,
    resistWu: 68,
    resistWei: 63,
    resistQun: 72,
    slayShu: 75,
    slayWu: 88,
    slayWei: 78,
    slayQun: 83,
    powerScore: 532,
  },
];

@Injectable({ providedIn: 'root' })
export class MemberDataService {
  private readonly membersRef = collection(firestore, MEMBERS_COLLECTION);

  async loadMembers(): Promise<DataLoadResult> {
    try {
      await ensureAuthenticatedUser();
      const snapshot = await getDocs(query(this.membersRef, orderBy('powerScore', 'desc')));
      const members = snapshot.docs.map((item) => this.toMember(item.id, item.data()));

      if (members.length > 0) {
        return {
          members,
          source: 'firestore',
          message: 'Đang đồng bộ với Firestore.',
        };
      }

      const localMembers = this.readLocalMembers();
      if (localMembers.length > 0) {
        return {
          members: localMembers,
          source: 'local',
          message: 'Firestore chưa có dữ liệu, đang dùng bản lưu trên máy.',
        };
      }

      return {
        members: SAMPLE_MEMBERS,
        source: 'sample',
        message: 'Firestore chưa có dữ liệu, đang hiển thị bộ mẫu để BQT thao tác thử.',
      };
    } catch (error) {
      const localMembers = this.readLocalMembers();

      return {
        members: localMembers.length > 0 ? localMembers : SAMPLE_MEMBERS,
        source: localMembers.length > 0 ? 'local' : 'sample',
        message: `Chưa kết nối được Firestore, dùng dữ liệu ${
          localMembers.length > 0 ? 'đã lưu trên máy' : 'mẫu'
        }. ${this.errorMessage(error)}`,
      };
    }
  }

  async saveMember(member: Member): Promise<SaveMemberResult> {
    const sanitized = this.sanitizeMember(member);

    try {
      const user = await ensureAuthenticatedUser();
      const payload = this.toFirestorePayload(sanitized, user.uid);

      if (sanitized.id) {
        const ref = doc(firestore, MEMBERS_COLLECTION, sanitized.id);
        const existing = await getDoc(ref);

        if (existing.exists()) {
          await updateDoc(ref, payload);
        } else {
          await setDoc(ref, {
            ...payload,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
          });
        }

        return {
          member: sanitized,
          source: 'firestore',
          message: 'Đã lưu thay đổi lên Firestore.',
        };
      }

      const docRef = await addDoc(this.membersRef, {
        ...payload,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      return {
        member: { ...sanitized, id: docRef.id },
        source: 'firestore',
        message: 'Đã thêm thành viên mới lên Firestore.',
      };
    } catch (error) {
      const localMember = this.upsertLocalMember(sanitized);

      return {
        member: localMember,
        source: 'local',
        message: `Firestore chưa sẵn sàng, đã lưu tạm trên máy. ${this.errorMessage(error)}`,
      };
    }
  }

  private toFirestorePayload(member: Member, uid: string) {
    return {
      registeredAt: Timestamp.fromDate(this.toDate(member.registeredAt)),
      zaloName: member.zaloName,
      gameName: member.gameName,
      gameId: member.gameId,
      gemLimitGold: member.gemLimitGold,
      gemLimitPurple: member.gemLimitPurple,
      gemNormalGold: member.gemNormalGold,
      gemNormalPurple: member.gemNormalPurple,
      gearHp: member.gearHp,
      gearAtk: member.gearAtk,
      resistShu: member.resistShu,
      resistWu: member.resistWu,
      resistWei: member.resistWei,
      resistQun: member.resistQun,
      slayShu: member.slayShu,
      slayWu: member.slayWu,
      slayWei: member.slayWei,
      slayQun: member.slayQun,
      powerScore: member.powerScore,
      updatedAt: serverTimestamp(),
      updatedBy: uid,
    };
  }

  private toMember(id: string, data: DocumentData): Member {
    return this.sanitizeMember({
      id,
      registeredAt: this.inputDate(data['registeredAt']),
      zaloName: this.stringValue(data['zaloName']),
      gameName: this.stringValue(data['gameName']),
      gameId: this.stringValue(data['gameId']),
      gemLimitGold: this.numberValue(data['gemLimitGold']),
      gemLimitPurple: this.numberValue(data['gemLimitPurple']),
      gemNormalGold: this.numberValue(data['gemNormalGold']),
      gemNormalPurple: this.numberValue(data['gemNormalPurple']),
      gearHp: this.numberValue(data['gearHp']),
      gearAtk: this.numberValue(data['gearAtk']),
      resistShu: this.numberValue(data['resistShu']),
      resistWu: this.numberValue(data['resistWu']),
      resistWei: this.numberValue(data['resistWei']),
      resistQun: this.numberValue(data['resistQun']),
      slayShu: this.numberValue(data['slayShu']),
      slayWu: this.numberValue(data['slayWu']),
      slayWei: this.numberValue(data['slayWei']),
      slayQun: this.numberValue(data['slayQun']),
      powerScore: this.numberValue(data['powerScore']),
    });
  }

  private sanitizeMember(member: Member): Member {
    return {
      ...member,
      id: member.id?.trim() ?? '',
      registeredAt: this.inputDate(member.registeredAt),
      zaloName: member.zaloName.trim(),
      gameName: member.gameName.trim(),
      gameId: member.gameId.trim().toUpperCase(),
      gemLimitGold: this.cleanNumber(member.gemLimitGold),
      gemLimitPurple: this.cleanNumber(member.gemLimitPurple),
      gemNormalGold: this.cleanNumber(member.gemNormalGold),
      gemNormalPurple: this.cleanNumber(member.gemNormalPurple),
      gearHp: this.cleanNumber(member.gearHp),
      gearAtk: this.cleanNumber(member.gearAtk),
      resistShu: this.cleanNumber(member.resistShu),
      resistWu: this.cleanNumber(member.resistWu),
      resistWei: this.cleanNumber(member.resistWei),
      resistQun: this.cleanNumber(member.resistQun),
      slayShu: this.cleanNumber(member.slayShu),
      slayWu: this.cleanNumber(member.slayWu),
      slayWei: this.cleanNumber(member.slayWei),
      slayQun: this.cleanNumber(member.slayQun),
      powerScore: this.cleanNumber(member.powerScore),
    };
  }

  private upsertLocalMember(member: Member): Member {
    const members = this.readLocalMembers();
    const localMember = {
      ...member,
      id: member.id || `local-${Date.now()}`,
    };
    const index = members.findIndex((item) => item.id === localMember.id);

    if (index >= 0) {
      members[index] = localMember;
    } else {
      members.push(localMember);
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
    return localMember;
  }

  private readLocalMembers(): Member[] {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as Member[];
      return parsed.map((member) => this.sanitizeMember(member));
    } catch {
      return [];
    }
  }

  private inputDate(value: unknown): string {
    if (value instanceof Timestamp) {
      return value.toDate().toISOString().slice(0, 10);
    }

    if (value && typeof value === 'object' && 'toDate' in value) {
      const date = (value as { toDate: () => Date }).toDate();
      return date.toISOString().slice(0, 10);
    }

    if (typeof value === 'string' && value.length >= 10) {
      return value.slice(0, 10);
    }

    return new Date().toISOString().slice(0, 10);
  }

  private toDate(value: string): Date {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? new Date() : date;
  }

  private stringValue(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private numberValue(value: unknown): number {
    return typeof value === 'number' ? value : Number(value);
  }

  private cleanNumber(value: number): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.round(numeric)) : 0;
  }

  private errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : '';
  }
}

