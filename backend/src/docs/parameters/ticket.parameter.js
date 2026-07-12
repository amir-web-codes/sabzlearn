module.exports = {
    AvailableOnlyParameter: {
        name: "availableOnly",
        in: "query",
        required: false,
        description: "اگر دقیقاً رشته‌ی \"true\" باشد، تیکت‌های closed از نتیجه حذف می‌شوند. هر مقدار دیگری (یا نبودنش) به معنی false است (مقایسه با === \"true\" در کنترلر انجام می‌شود)",
        schema: { type: "string", enum: ["true", "false"], default: "false" },
        example: "true"
    }
}