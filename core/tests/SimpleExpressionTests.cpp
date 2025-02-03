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


#define BOOST_TEST_MODULE SimpleExpressionTestsModule
#include <boost/test/included/unit_test.hpp>

#include "Expression.h"
#include <limits>

using namespace MasterMath;

BOOST_AUTO_TEST_CASE(SimpleExpressionTest)
{
    {
        SimpleExpression expr(3.4, 3.6, Operator::Add);
        expr.Solve();
        BOOST_CHECK(expr.GetAnswer() == SimpleExpressionAnswer(7.0));
    }
    {
        SimpleExpression expr(3.4, 3.6, Operator::Sub);
        expr.Solve();
        BOOST_CHECK(expr.GetAnswer() == SimpleExpressionAnswer(-0.2));
    }
    {
        SimpleExpression expr(10.0, 2.0, Operator::Div);
        expr.Solve();
        BOOST_CHECK(expr.GetAnswer() == SimpleExpressionAnswer(5.0));
    }
    {
        try
        {
            SimpleExpression expr(10.0, 0, Operator::Div);
            expr.Solve();
        }
        catch (const std::exception& e)
        {
            BOOST_CHECK(e.what() == std::string("Division by 0"));
        }
    }
}
