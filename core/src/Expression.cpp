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

#include "Expression.h"
#include <iostream>
namespace MasterMath
{

    SimpleExpression::SimpleExpression(Constant a, Constant b, Operator op)
        : m_a{ a }
        , m_b{ b }
        , m_op{ op }
    {
    }

    bool SimpleExpression::CheckAnswer(SimpleExpressionAnswer answer) const noexcept
    {
        return m_answer == answer;
    }

    void SimpleExpression::Solve() noexcept(false)
    {
        switch (m_op)
        {
        case Operator::Add:
            m_answer = m_a.GetValue() + m_b.GetValue();
            break;
        case Operator::Sub:
            m_answer = m_a.GetValue() - m_b.GetValue();
            break;
        case Operator::Div:
        {
            if (m_b.GetValue() == 0.0)
            {
                throw std::runtime_error("Division by 0");
            }

            m_answer = m_a.GetValue() / m_b.GetValue();
            break;
        }
        case Operator::Mul:
            m_answer = m_a.GetValue() * m_b.GetValue();
            break;
        default:
            throw std::runtime_error("Unsupported operation");
        }
    }

    SimpleExpressionAnswer SimpleExpression::GetAnswer() const noexcept
    {
        return m_answer;
    }
}
