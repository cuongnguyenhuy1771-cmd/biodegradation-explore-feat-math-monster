import type { Hero } from '@/services/mathMonsters.service'

const now = new Date().toISOString()

/** Dữ liệu mẫu khi Supabase chưa seed — chỉ để hiển thị UI */
export const FALLBACK_HEROES: Hero[] = [
  {
    id: 'local-thien-dinh',
    slug: 'thien-dinh',
    name: 'Thiên Định',
    description: 'Anh hùng mạnh mẽ với sức mạnh toán học vượt trội.',
    image_url: null,
    sort_order: 1,
    is_default: true,
    created_at: now,
  },
  {
    id: 'local-linh-chi',
    slug: 'linh-chi',
    name: 'Linh Chi',
    description: 'Nữ chiến binh thông minh, giải toán nhanh như chớp.',
    image_url: null,
    sort_order: 2,
    is_default: false,
    created_at: now,
  },
  {
    id: 'local-bao-an',
    slug: 'bao-an',
    name: 'Bảo An',
    description: 'Cậu bé tò mò, luôn khám phá thế giới số.',
    image_url: null,
    sort_order: 3,
    is_default: false,
    created_at: now,
  },
  {
    id: 'local-minh-quang',
    slug: 'minh-quang',
    name: 'Minh Quang',
    description: 'Chiến binh trẻ đầy nhiệt huyết.',
    image_url: null,
    sort_order: 4,
    is_default: false,
    created_at: now,
  },
]

export function isLocalHeroId(id: string) {
  return id.startsWith('local-')
}
