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

#include "EventHandlers.h"

namespace Core::EventHandlers
{
    void GenerateExpressionsHandler(webui::window::event* event)
    {
        try
        {
            std::string json = event->get_string(0);
            boost::json::value value = boost::json::parse(json);

            ExpressionGenerator::Config config;
            int64_t amount = value.at("amount").as_int64();

            if (amount <= 0)
                throw std::invalid_argument("The number of expressions must be positive.");

            config.min = value.at("min").as_int64();
            config.max = value.at("max").as_int64();
            config.useAdd = value.at("useAdd").as_bool();
            config.useSub = value.at("useSub").as_bool();
            config.useMul = value.at("useMul").as_bool();
            config.useDiv = value.at("useDiv").as_bool();
            config.useFloats = false;

            const auto exprs = GenerateExpressions(config, amount);

            event->return_string(boost::json::serialize(exprs));
        }
        catch (const std::exception& e)
        {
            boost::json::object errJson;
            errJson["error"] = e.what();
            event->return_string(boost::json::serialize(errJson));
        }
    }

    boost::json::object GenerateExpressions(ExpressionGenerator::Config conf, size_t amount)
    {
        mu::Parser parser;
        ExpressionGenerator generator(conf);
        std::stringstream ss;

        boost::json::object jsonObj;
        boost::json::array expressionsArrObj;
        boost::json::array answersArrObj;
        expressionsArrObj.reserve(amount);
        answersArrObj.reserve(amount);

        while (amount--)
        {
            const std::string expr = generator.GenerateExpression();
            parser.SetExpr(expr);
            ss << std::setprecision(3) << std::noshowpoint << parser.Eval();
            expressionsArrObj.emplace_back(expr);
            answersArrObj.emplace_back(ss.str());

            ss.str("");
        }

        jsonObj["expressions"] = std::move(expressionsArrObj);
        jsonObj["answers"] = std::move(answersArrObj);

        return jsonObj;
    }
}
