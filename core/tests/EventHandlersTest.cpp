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


#include <boost/test/unit_test.hpp>

#include "pch.h"
#include "EventHandlers.h"
#include "ExpressionGenerator.h"

using namespace Core;
using namespace boost::json;

BOOST_AUTO_TEST_CASE(GenerateExpressionsHandler)
{
    ExpressionGenerator::Config config;
    config.min = 1;
    config.max = 10;
    config.useAdd = true;
    config.useSub = true;
    config.useMul = true;
    config.useDiv = true;
    config.useFloats = true;
    size_t amount = 5;

    object json = EventHandlers::GenerateExpressions(config, amount);

    BOOST_REQUIRE(json.contains("expressions"));
    BOOST_REQUIRE(json.contains("answers"));

    BOOST_REQUIRE(json["expressions"].is_array());
    BOOST_REQUIRE(json["answers"].is_array());

    const array expressions = json["expressions"].as_array();
    const array answers = json["answers"].as_array();


    BOOST_REQUIRE(expressions.size() == amount);
    BOOST_REQUIRE(answers.size() == amount);

    mu::Parser parser;
    std::stringstream ss;
    for (size_t i = 0; i < amount; ++i)
    {
        const std::string expr = expressions[i].as_string().c_str();
        parser.SetExpr(expr);
        ss << std::setprecision(3) << std::noshowpoint << parser.Eval();
        const std::string answer = ss.str();
        const std::string answer2 = answers[i].as_string().c_str();
        BOOST_CHECK_EQUAL(answer, answer2);
        ss.str("");
    }
}
