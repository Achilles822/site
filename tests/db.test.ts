import { afterEach, describe, expect, it } from "vitest"
import { getSql } from "../lib/db"

const original = process.env.DATABASE_URL

afterEach(() => {
  if (original === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = original
})

describe("getSql", () => {
  it("缺少 DATABASE_URL 时抛出明确错误", () => {
    delete process.env.DATABASE_URL
    expect(() => getSql()).toThrow("缺少 DATABASE_URL")
  })

  it("导入模块时不连接数据库", async () => {
    delete process.env.DATABASE_URL
    await expect(import("../lib/db")).resolves.toBeTruthy()
  })
})
