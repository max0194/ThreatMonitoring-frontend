import { RequestFact, RequestItem } from "../types"

export const mockRequests: RequestItem[] = [{
  id: 1,
  title: "Ошибка в системе",
  description: "Случайно поймал ошибку в системе",
  status: "awaiting",
  created_at: "2026-01-01",
  result_count: 1
},
{
  id: 2,
  title: "Возник вирус",
  description: "Скачался вирус, помогите",
  status: "complete",
  created_at: "2026-01-01",
  result_count: 1
},
{
  id: 3,
  title: "Пропали файлы",
  description: "В ходе работы пропали важные файлы",
  status: "taken",
  created_at: "2026-01-01",
  result_count: 1
},
]

export const mockRequestsFacts: RequestFact[] = [{
  id: 1,
  title: "Вылезла ошибка",
  description: "Вылезло окно с ошибкой, когда я пытался открыть файл",
  request_id: 1,
  created_at: "2026-01-01",
  screenshot_url: "1"
},
{
  id: 2,
  title: "Сильно тормозит компьютер",
  description: "После скачивания вируса компьютер стал сильно тормозить",
  request_id: 2,
  created_at: "2026-01-01",
  screenshot_url: "2"
},
{
  id: 3,
  title: "Пропала папка с документами",
  description: "В ходе работы пропали важные файлы",
  request_id: 3,
  created_at: "2026-01-01",
  screenshot_url: "3"
},
]
