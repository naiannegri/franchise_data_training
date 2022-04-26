"use strict";
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
        while (_) try {
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
exports.AppService = void 0;
var export_from_json_1 = require("export-from-json");
var puppeteer = require('puppeteer');
var AppService = /** @class */ (function () {
    function AppService() {
    }
    AppService.prototype.onModuleInit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AppService.prototype.getDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, allNewData, allData, i, pageUrl, textInvestment, valueInvestment, value, profile, fileName, exportType;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.browser.newPage()];
                    case 1:
                        _a.page = _b.sent();
                        allNewData = [];
                        allData = require('../data.json');
                        allNewData.push(allData);
                        i = 0;
                        _b.label = 2;
                    case 2:
                        if (!(i < allData.length)) return [3 /*break*/, 10];
                        pageUrl = allData[i].pageUrl;
                        return [4 /*yield*/, this.page.goto(pageUrl)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, new Promise(function (resolve) { setTimeout(resolve, 1000); })];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, this.page.$$eval('.p-title-default', function (divs) { return divs.map(function (_a) {
                                var innerText = _a.innerText;
                                return innerText;
                            }); })];
                    case 5:
                        textInvestment = _b.sent();
                        return [4 /*yield*/, this.page.$$eval('.bold-default', function (divs) { return divs.map(function (_a) {
                                var innerText = _a.innerText;
                                return innerText;
                            }); })];
                    case 6:
                        valueInvestment = _b.sent();
                        return [4 /*yield*/, this.page.evaluate(function (el) { return el.textContent; }, '#leftColMinisite')];
                    case 7:
                        value = _b.sent();
                        console.log(value);
                        return [4 /*yield*/, this.page.$eval("#leftColMinisite > div > div > div.tab-content.about", function (el) { return el.innerText; })];
                    case 8:
                        profile = _b.sent();
                        console.log(profile);
                        //console.log(textInvestment,valueInvestment)
                        // textInvestment = textInvestment.split(',');
                        // valueInvestment = valueInvestment.split(',');
                        //  console.log(textInvestment,valueInvestment)
                        if ((textInvestment.length == 5) || (textInvestment.length == 4)) {
                            allNewData[0][i]['retorno'] = valueInvestment[1];
                            allNewData[0][i]['unidadesTotais'] = valueInvestment[2];
                            allNewData[0][i]['contato'] = valueInvestment[3];
                            allNewData[0][i]['perfil do franqueado'] = profile;
                        }
                        else if ((textInvestment.length == 6)) {
                            allNewData[0][i]['retorno'] = valueInvestment[1];
                            allNewData[0][i]['faturamentoMedio'] = valueInvestment[2];
                            allNewData[0][i]['unidadesTotais'] = valueInvestment[3];
                            allNewData[0][i]['contato'] = valueInvestment[4];
                            allNewData[0][i]['perfil do franqueado'] = profile;
                        }
                        console.log(allNewData);
                        _b.label = 9;
                    case 9:
                        i++;
                        return [3 /*break*/, 2];
                    case 10:
                        fileName = 'abfData';
                        exportType = 'xls';
                        (0, export_from_json_1["default"])({ allNewData: allNewData, fileName: fileName, exportType: exportType });
                        console.log("JSON data is saved.");
                        return [2 /*return*/];
                }
            });
        });
    };
    AppService.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, puppeteer.launch({
                                headless: false,
                                userDataDir: "./profileData"
                            })];
                    case 1:
                        _a.browser = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AppService;
}());
exports.AppService = AppService;
