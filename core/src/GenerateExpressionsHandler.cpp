/*
* MIT License

* Copyright (c) 2025 Denis Klintukhov

* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:

* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.

* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

#include "pch.h"

#include "ExpressionGenerator.h"
#include "EventHandlers.h"

namespace Core
{
    void GenerateExpressionsHandler(webui::window::event* event) noexcept
    {
        try
        {
            std::string json = event->get_string(0);
            boost::json::value value = boost::json::parse(json);

            ExpressionGenerator::Config config;
            int64_t amount = value.at("amount").as_int64();
            config.min = value.at("min").as_int64();
            config.max = value.at("max").as_int64();
            config.useAdd = value.at("useAdd").as_bool();
            config.useSub = value.at("useSub").as_bool();
            config.useMul = value.at("useMul").as_bool();
            config.useDiv = value.at("useDiv").as_bool();
            config.useFloats = false;

            // std::cout << "json: " << json << std::endl;
            // std::cout << "amount: " << amount << std::endl;
            // std::cout << "min: " << config.min << std::endl;
            // std::cout << "max: " << config.max << std::endl;
            // std::cout << "useAdd: " << config.useAdd << std::endl;
            // std::cout << "useSub: " << config.useSub << std::endl;
            // std::cout << "useMul: " << config.useMul << std::endl;
            // std::cout << "useDiv: " << config.useDiv << std::endl;
            // std::cout << "useFloats: " << config.useFloats << std::endl;

            mu::Parser parser;
            ExpressionGenerator generator(config);

            boost::json::object jsonObj;
            boost::json::array expressionsArrObj;
            boost::json::array answersArrObj;

            for (int i = 0; i < amount; ++i)
            {
                std::string expr = generator.GenerateExpression();
                parser.SetExpr(expr);
                int answer = parser.Eval();
                expressionsArrObj.emplace_back(expr);
                answersArrObj.push_back(answer);
            }

            jsonObj["expressions"] = std::move(expressionsArrObj);
            jsonObj["answers"] = std::move(answersArrObj);

            std::string serializedJson = boost::json::serialize(jsonObj);

            event->return_string(serializedJson);
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();
            event->return_string(boost::json::serialize(errJson));
        }
    }
}
