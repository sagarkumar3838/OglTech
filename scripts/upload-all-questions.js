"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var supabase_js_1 = require("@supabase/supabase-js");
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var sync_1 = require("csv-parse/sync");
var dotenv = __importStar(require("dotenv"));
// Load environment variables from .env file
dotenv.config();
// Initialize Supabase client
var supabaseUrl = process.env.VITE_SUPABASE_URL || '';
// Use service role key for bulk uploads (bypasses RLS)
var supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Missing Supabase credentials!');
    console.error('Please check your .env file has:');
    console.error('  VITE_SUPABASE_URL=https://your-project.supabase.co');
    console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    process.exit(1);
}
console.log('✅ Using Supabase URL:', supabaseUrl);
console.log('✅ Using key type:', supabaseKey.includes('service_role') ? 'SERVICE_ROLE' : 'ANON');
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
function uploadQuestionsFromCSV(filePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, records, questions, batchSize, uploadedCount, i, batch, _a, data, error, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    fileContent = fs.readFileSync(filePath, 'utf-8');
                    records = (0, sync_1.parse)(fileContent, {
                        columns: true,
                        skip_empty_lines: true,
                        trim: true,
                        relax_column_count: true,
                        quote: '"',
                        escape: '"',
                        relax_quotes: true
                    });
                    if (records.length === 0) {
                        console.log("\u26A0\uFE0F  No questions found in ".concat(path.basename(filePath)));
                        return [2 /*return*/, 0];
                    }
                    questions = records.map(function (record) { return ({
                        skill: record.skill || extractSkillFromFilename(filePath),
                        level: record.level || extractLevelFromFilename(filePath),
                        question_text: record.question_text || record.question,
                        option_a: record.option_a || null,
                        option_b: record.option_b || null,
                        option_c: record.option_c || null,
                        option_d: record.option_d || null,
                        correct_answer: record.correct_answer,
                        explanation: record.explanation || null,
                        topic: record.topic || null,
                        mdn_link: record.mdn_link || null,
                        youtube_english: record.youtube_english || null,
                        youtube_hindi: record.youtube_hindi || null,
                        youtube_kannada: record.youtube_kannada || null,
                        youtube_tamil: record.youtube_tamil || null,
                        youtube_telugu: record.youtube_telugu || null,
                        question_type: 'descriptive'
                    }); });
                    batchSize = 100;
                    uploadedCount = 0;
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < questions.length)) return [3 /*break*/, 4];
                    batch = questions.slice(i, i + batchSize);
                    return [4 /*yield*/, supabase
                            .from('practice_questions')
                            .insert(batch)];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("\u274C Error uploading batch from ".concat(path.basename(filePath), ":"), error.message);
                        return [3 /*break*/, 3];
                    }
                    uploadedCount += batch.length;
                    console.log("\u2705 Uploaded ".concat(uploadedCount, "/").concat(questions.length, " questions from ").concat(path.basename(filePath)));
                    _b.label = 3;
                case 3:
                    i += batchSize;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, uploadedCount];
                case 5:
                    error_1 = _b.sent();
                    console.error("\u274C Error processing ".concat(filePath, ":"), error_1);
                    return [2 /*return*/, 0];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function extractSkillFromFilename(filePath) {
    var filename = path.basename(filePath, '.csv');
    var parts = filename.split('-');
    return parts[0] || 'unknown';
}
function extractLevelFromFilename(filePath) {
    var filename = path.basename(filePath, '.csv');
    if (filename.includes('beginner'))
        return 'Basic';
    if (filename.includes('intermediate'))
        return 'Intermediate';
    if (filename.includes('advanced'))
        return 'Advanced';
    return 'Basic';
}
function uploadAllQuestions() {
    return __awaiter(this, void 0, void 0, function () {
        var questionsDir, files, totalUploaded, results, _i, files_1, file, filePath, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🚀 Starting upload of all practice questions...\n');
                    questionsDir = path.join(__dirname, '..', 'questions');
                    if (!fs.existsSync(questionsDir)) {
                        console.error('❌ Questions directory not found!');
                        return [2 /*return*/];
                    }
                    files = fs.readdirSync(questionsDir)
                        .filter(function (file) { return file.endsWith('.csv'); })
                        .sort();
                    console.log("\uD83D\uDCC1 Found ".concat(files.length, " CSV files\n"));
                    totalUploaded = 0;
                    results = [];
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    filePath = path.join(questionsDir, file);
                    console.log("\n\uD83D\uDCC4 Processing: ".concat(file));
                    return [4 /*yield*/, uploadQuestionsFromCSV(filePath)];
                case 2:
                    count = _a.sent();
                    totalUploaded += count;
                    results.push({ file: file, count: count });
                    // Small delay to avoid rate limiting
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 500); })];
                case 3:
                    // Small delay to avoid rate limiting
                    _a.sent();
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log('\n' + '='.repeat(60));
                    console.log('📊 UPLOAD SUMMARY');
                    console.log('='.repeat(60));
                    console.log("Total files processed: ".concat(files.length));
                    console.log("Total questions uploaded: ".concat(totalUploaded));
                    console.log('\n📋 Breakdown by file:');
                    results.forEach(function (_a) {
                        var file = _a.file, count = _a.count;
                        console.log("  ".concat(file, ": ").concat(count, " questions"));
                    });
                    console.log('\n✅ Upload complete!');
                    return [2 /*return*/];
            }
        });
    });
}
// Run the upload
uploadAllQuestions()["catch"](console.error);
